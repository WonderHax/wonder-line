import { assertEquals } from "@std/assert";
import { TypedEventEmitter } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/C:/Users/Admin/Documents/work/wonder-line/linejs/packages/linejs/base/core/typed-event-emitter/index.ts";

Deno.test("promise() should be vaild", async () => {
	type Events = {
		example: (v: number) => void;
	};
	class Client extends TypedEventEmitter<Events, "example"> {}
	const client = new Client();

	const promise = client.waitFor("example");

	client.emit("example", 123456);

	const [v] = await promise;

	assertEquals(v, 123456);
});
