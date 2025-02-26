import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { Static, Type } from "@sinclair/typebox";

// Define request schema for type safety and validation
const SpeechRequestSchema = Type.Object({
  text: Type.String(),
  voice: Type.String(),
  speed: Type.Number(),
});

type SpeechRequest = Static<typeof SpeechRequestSchema>;

export default async function (fastify: FastifyInstance) {
  // Speech generation endpoint
  fastify.post<{
    Body: SpeechRequest;
  }>(
    "/speech",
    {
      schema: {
        body: SpeechRequestSchema,
        response: {
          500: {
            type: "object",
            properties: {
              error: { type: "string" },
              errorMessage: { type: "string" },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { text, voice, speed } = request.body as SpeechRequest;

        // Check if OpenAI API key exists
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
          reply.code(500);
          return { error: "OpenAI API key not configured" };
        }

        const response = await fetch("https://api.openai.com/v1/audio/speech", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "tts-1",
            voice,
            input: text,
            speed,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          fastify.log.error(
            `OpenAI API error: ${response.status} ${JSON.stringify(errorData)}`
          );
          reply.code(response.status);
          return {
            error: "OpenAI API request failed",
            errorMessage: errorData.error?.message || response.statusText,
          };
        }

        // Get the audio data
        const audioBuffer = await response.arrayBuffer();

        // Set appropriate headers for audio response
        reply
          .header("Content-Type", "audio/mpeg")
          .send(Buffer.from(audioBuffer));

        return {
          success: true,
        };
      } catch (error) {
        fastify.log.error("Error in speech route:", error);
        reply.code(500);
        return {
          error: "Failed to generate speech",
          errorMessage: error instanceof Error ? error.message : String(error),
        };
      }
    }
  );
}
