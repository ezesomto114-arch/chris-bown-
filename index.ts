import { router, json, error } from '@appdeploy/sdk';
import { ai } from '@appdeploy/sdk';

const systemPrompt = `You are the helpful guest assistant for the Chris Brown Meet & Greet fan experience website. Answer questions about the website's packages, RSVP interest form, FAQ, and general guest experience using only the information provided in the site context below. Do not claim the site is officially affiliated with or endorsed by Chris Brown. This is a fan-event concept. Never invent confirmed dates, venues, ticket availability, prices, payment status, or organizer details beyond the illustrative package prices shown. If asked for current official event details, tell the guest to verify them with the authorized event organizer or ticketing provider. Be concise, friendly, and practical.

Site context:
- Packages shown are illustrative: Fan Experience $299, VIP Meet & Greet $599, Ultimate Access $999.
- Fan Experience includes professional photo opportunity, event laminate, signed 8x10 keepsake, and early venue entry.
- VIP Meet & Greet adds a personal meet & greet, premium photo session, limited-edition VIP merch, and priority check-in.
- Ultimate Access adds an extended one-on-one experience, premium signed collectible, exclusive gift box, and front-of-line access.
- Event date is currently listed as to be announced; check-in details follow confirmation; location is a selected event city.
- The RSVP form records interest only and does not charge the visitor.
- Guests should bring ticket confirmation and valid photo ID.
- Package transfer policies vary by event.
- Registered guests receive schedule and check-in instructions when details are finalized.`;

export const handler = router({
    'POST /api/ai-chat': [async ({ body }) => {
        const payload = body as { message?: string; history?: Array<{ role: 'user' | 'assistant'; content: string }> };
        const message = payload.message?.trim();
        if (!message) {
            return error('Please enter a message.', 400);
        }

        const history = Array.isArray(payload.history) ? payload.history.slice(-8) : [];
        try {
            const result = await ai.generate({
                system: systemPrompt,
                messages: [
                    ...history,
                    { role: 'user', content: message },
                ],
                maxTokens: 350,
                temperature: 0.3,
                thinkingMode: 'FAST',
            });
            return json({ reply: result.text });
        } catch (err) {
            console.error('AI chat failed', err);
            return error('The assistant is temporarily unavailable. Please try again.', 500);
        }
    }],
    'GET /api/_healthcheck': [async () => json({ message: 'Success' })],
});