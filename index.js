import { checkConnection } from "./components/CheckConnection.js";
import { getNewIPAddress } from "./components/GetNewIPAddress.js";
import { getConfig } from "./components/GetConfig.js";
import { updateDNSRecord } from "./components/UpdateDNSRecord.js";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let configData = null; // config data
let newIP = null; // new IP
let updateIntervalMinutes = 5; // thời gian update IP (phút)
const updateIntervalMs = 60 * 1000 * updateIntervalMinutes; // đổi phút sang mili giây
const httpPort = 1499; // cổng HTTP Server

// Tạo Express app để phục vụ trang web
const app = express();

// Phục vụ static files từ thư mục public
app.use(express.static(path.join(__dirname, 'public')));

// Phục vụ static files từ thư mục asset (cho logo và media)
app.use('/asset', express.static(path.join(__dirname, 'asset')));

// API endpoint để lấy config
app.get('/api/config', (req, res) => {
	if (configData) {
		// Chỉ trả về thông tin hostname, không trả về sensitive data
		res.json({ hostname: configData.hostname });
	} else {
		res.json({ hostname: [] });
	}
});

// API endpoint để lấy IP hiện tại
app.get('/api/ip', (req, res) => {
	res.json({ IP: newIP });
});

// Khởi động HTTP server
app.listen(httpPort, () => {
	console.log(`HTTP Server is running on http://localhost:${httpPort}`);
});

const main = async () => {
	do {
		try {
			// get configuration
			await getConfig()
				.then(async (config) => {
					configData = config.config;
					// check connection
					await checkConnection()
						.then(async () => {
							// get new IP address
							await getNewIPAddress()
								.then(async (ip) => {
									newIP = ip;
									// console.log('New IP address obtained:', newIP);
									// update DNS record
									await updateDNSRecord(configData, newIP);
								})
								.catch((error) => {
									throw new Error(error);
								});
						})
						.catch((error) => {
							// console.log(`Retrying in ${updateIntervalMinutes} minutes ...`);
							throw new Error(error);
						});
				})
				.catch((error) => {
					throw new Error(error);
				});
			// console.log('-'.repeat(process.stdout.columns));
		} catch (error) {
			// console.log('-'.repeat(process.stdout.columns));
			console.error(error);
			// console.log('-'.repeat(process.stdout.columns));
		}
		// wait for the next update
		await new Promise((resolve) => setTimeout(resolve, updateIntervalMs));
	} while (true);
};

main();
