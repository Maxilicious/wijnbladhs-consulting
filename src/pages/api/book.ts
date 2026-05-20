import type { APIRoute } from 'astro';
import { parse, isValid, addMinutes, isAfter, isBefore, parseISO } from 'date-fns';
import { getFreeBusy, createEvent } from '../../lib/gcal';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, date, time, duration, topic } = body;

    // Validate required fields
    if (!name || !email || !date || !time || !duration || !topic) {
      return new Response(JSON.stringify({ success: false, error: 'All fields are required.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid email address.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Validate date and time
    const requestedDate = parse(date, 'yyyy-MM-dd', new Date());
    if (!isValid(requestedDate)) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid date format. Use YYYY-MM-DD.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid time format. Use HH:MM.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const parsedDuration = parseInt(duration, 10);
    if (isNaN(parsedDuration) || parsedDuration <= 0 || parsedDuration > 120) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid duration.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Combine date and time
    const [hours, minutes] = time.split(':').map(Number);
    const startDateTime = new Date(requestedDate);
    startDateTime.setHours(hours, minutes, 0, 0);

    const endDateTime = addMinutes(startDateTime, parsedDuration);

    // Ensure booking is in the future
    if (isBefore(startDateTime, new Date())) {
        return new Response(JSON.stringify({ success: false, error: 'Cannot book a meeting in the past.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }


    // Final race-condition check
    const startIso = startDateTime.toISOString();
    const endIso = endDateTime.toISOString();
    const bufferMinutes = parseInt(import.meta.env.BOOKING_BUFFER_MINUTES || '0', 10);
    const extendedEndDateTime = addMinutes(endDateTime, bufferMinutes);

    // Call getFreeBusy for the exact requested slot (including buffer)
    const busyIntervals = await getFreeBusy(startIso, extendedEndDateTime.toISOString());

    // Check for any overlap in the requested specific time frame
    let isTaken = false;
    for (const busy of busyIntervals) {
        const busyStart = parseISO(busy.start);
        const busyEnd = parseISO(busy.end);

        // Check for overlap
        if (isBefore(startDateTime, busyEnd) && isAfter(extendedEndDateTime, busyStart)) {
            isTaken = true;
            break;
        }
    }

    if (isTaken) {
      return new Response(JSON.stringify({ success: false, error: 'That slot was just taken. Please choose another time.' }), { status: 409, headers: { 'Content-Type': 'application/json' } });
    }

    // Create event
    const description = `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\nRequested Date: ${date}\nRequested Time: ${time}\nDuration: ${duration} minutes`;

    const event = await createEvent({
      summary: `Meeting: ${topic} with ${name}`,
      start: startIso,
      end: endIso,
      attendeeEmail: email,
      description: description,
    });

    return new Response(JSON.stringify({ success: true, eventLink: event.htmlLink }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (error: any) {
    console.error('Error creating booking:', error);
    return new Response(JSON.stringify({ success: false, error: 'An error occurred while booking the meeting. Please try again later.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
