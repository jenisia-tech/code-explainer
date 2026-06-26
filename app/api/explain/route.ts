import Groq from "groq-sdk";


export async function POST(req: Request) {
  try {
    const groq = new Groq({
      apiKey: process.env.MY_GROQ_KEY,
    });

    const { code } = await req.json();

    if (!code) {
      return Response.json({ error: "Code is required" }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI code explainer. Explain code clearly and simply.",
        },
        {
          role: "user",
          content: `Explain this code:\n\n${code}`,
        },
      ],
    });

    return Response.json({
      explanation: completion.choices[0]?.message?.content || "No explanation found.",
    });
  } catch (error) {
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}