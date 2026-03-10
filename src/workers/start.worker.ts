import { connectToDatabase } from "../config/database";

(async () => {
	try {
		await connectToDatabase();
		await import("../queue/job.worker");
		console.log("Job worker started and listening for jobs...");
	} catch (err) {
		console.error("Failed to start job worker:", err);
		process.exit(1);
	}
})();