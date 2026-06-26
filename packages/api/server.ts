import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const PORT = parseInt(process.env.PORT ?? "3000", 10);

async function start(): Promise<void> {
  try {
    const { app } = await import("./app");
    const { initializeDatabase } = await import("./src/lib/db");

    await initializeDatabase();

    app.listen(PORT, () => {
      console.info(`API server running on http://localhost:${PORT}`);
      console.info(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();
