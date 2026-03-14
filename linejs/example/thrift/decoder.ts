import { Thrift } from "@evex/linejs/thrift";
import { Buffer } from "node:buffer";

// @ts-types="thrift-types"
import * as thrift from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/packages/types/thrift.ts";

const thriftClient = new Thrift();
console.log(
	thriftClient.readThrift(
		Deno.readFileSync("./http-body.bin"),
		thrift.TCompactProtocol,
	),
);
