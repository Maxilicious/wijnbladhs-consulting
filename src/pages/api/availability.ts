import type { APIRoute } from 'astro';
import { addMinutes, differenceInDays, format, isAfter, isBefore, isValid, parse, parseISO, startOfDay, isSameDay } from 'date-fns';
import { getFreeBusy } from '../../lib/gcal';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const dateStr = url.searchParams.get('date');
  const durationStr = url.searchParams.get('duration') || '30';

  if (!dateStr) {
    return new Response(JSON.stringify({ error: 'Date parameter is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const requestedDate = parse(dateStr, 'yyyy-MM-dd', new Date());
  if (!isValid(requestedDate)) {
    return new Response(JSON.stringify({ error: 'Invalid date format. Use YYYY-MM-DD' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const duration = parseInt(durationStr, 10);
  if (isNaN(duration) || duration <= 0) {
    return new Response(JSON.stringify({ error: 'Invalid duration' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const now = new Date();
  const today = startOfDay(now);
  const reqStartOfDay = startOfDay(requestedDate);

  if (isBefore(reqStartOfDay, today)) {
    return new Response(JSON.stringify({ date: dateStr, slots: [] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  const bookingMaxDaysAhead = parseInt(import.meta.env.BOOKING_MAX_DAYS_AHEAD || '30', 10);
  if (differenceInDays(reqStartOfDay, today) > bookingMaxDaysAhead) {
    return new Response(JSON.stringify({ error: `Cannot book more than ${bookingMaxDaysAhead} days in advance` }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const bookingDaysStr = import.meta.env.BOOKING_DAYS || '1,2,3,4,5';
  const bookingDays = bookingDaysStr.split(',').map((d: string) => parseInt(d.trim(), 10));
  const requestedDayOfWeek = requestedDate.getDay();
  // date-fns getDay() returns 0 for Sunday, 1 for Monday, etc.
  if (!bookingDays.includes(requestedDayOfWeek)) {
    return new Response(JSON.stringify({ date: dateStr, slots: [] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  const startHour = parseInt(import.meta.env.BOOKING_START_HOUR || '9', 10);
  const endHour = parseInt(import.meta.env.BOOKING_END_HOUR || '17', 10);
  const slotMinutes = parseInt(import.meta.env.BOOKING_SLOT_MINUTES || '30', 10);
  const bufferMinutes = parseInt(import.meta.env.BOOKING_BUFFER_MINUTES || '0', 10);

  const candidateSlots: Date[] = [];
  let currentSlot = new Date(reqStartOfDay);
  currentSlot.setHours(startHour, 0, 0, 0);
  const endOfDayTime = new Date(reqStartOfDay);
  endOfDayTime.setHours(endHour, 0, 0, 0);

  while (isBefore(currentSlot, endOfDayTime)) {
    const slotEnd = addMinutes(currentSlot, duration);
    if (isAfter(slotEnd, endOfDayTime)) {
      break;
    }

    // if today, make sure the slot is in the future
    if (isSameDay(reqStartOfDay, today)) {
        if (isAfter(currentSlot, now)) {
            candidateSlots.push(new Date(currentSlot));
        }
    } else {
        candidateSlots.push(new Date(currentSlot));
    }

    currentSlot = addMinutes(currentSlot, slotMinutes);
  }

  if (candidateSlots.length === 0) {
    return new Response(JSON.stringify({ date: dateStr, slots: [] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const timeMin = new Date(reqStartOfDay);
    timeMin.setHours(0, 0, 0, 0);
    const timeMax = new Date(reqStartOfDay);
    timeMax.setHours(23, 59, 59, 999);

    const busyIntervals = await getFreeBusy(timeMin.toISOString(), timeMax.toISOString());

    const availableSlots = candidateSlots.filter(slot => {
      const slotStart = slot;
      const slotEnd = addMinutes(slotStart, duration + bufferMinutes);

      for (const busy of busyIntervals) {
        const busyStart = parseISO(busy.start);
        const busyEnd = parseISO(busy.end);

        // Check for overlap
        if (isBefore(slotStart, busyEnd) && isAfter(slotEnd, busyStart)) {
          return false; // Overlaps, not available
        }
      }
      return true;
    });

    const formattedSlots = availableSlots.map(slot => format(slot, 'HH:mm'));

    return new Response(JSON.stringify({ date: dateStr, slots: formattedSlots }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    console.error('Error fetching free/busy data:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch availability' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
