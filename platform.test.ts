import assert from "node:assert/strict";
import { test } from "node:test";
import { escapePowerShellSingleQuoted, isWindowsOrWSL, powerShellBinary } from "./platform.ts";

const missingProcVersion = () => { throw new Error("/proc/version unavailable"); };

test("native Windows is supported without reading /proc/version", () => {
	assert.equal(isWindowsOrWSL("win32", {}, missingProcVersion), true);
});

test("WSL_DISTRO_NAME identifies WSL", () => {
	assert.equal(isWindowsOrWSL("linux", { WSL_DISTRO_NAME: "Ubuntu" }, missingProcVersion), true);
});

test("WSL_INTEROP identifies WSL", () => {
	assert.equal(isWindowsOrWSL("linux", { WSL_INTEROP: "/run/WSL/interop" }, missingProcVersion), true);
});

test("macOS ignores WSL environment markers without reading /proc/version", () => {
	assert.equal(isWindowsOrWSL("darwin", { WSL_INTEROP: "/run/WSL/interop" }, missingProcVersion), false);
	assert.equal(isWindowsOrWSL("darwin", { WSL_DISTRO_NAME: "Ubuntu" }, missingProcVersion), false);
});

test("empty WSL markers do not identify WSL on Linux", () => {
	assert.equal(isWindowsOrWSL("linux", { WSL_DISTRO_NAME: "" }, missingProcVersion), false);
	assert.equal(isWindowsOrWSL("linux", { WSL_INTEROP: "" }, () => "Linux version 6.6.0-generic"), false);
});

test("/proc/version identifies WSL case-insensitively", () => {
	assert.equal(isWindowsOrWSL("linux", {}, () => "Linux version 6.6.87.2-MiCrOsOfT-standard-WSL2"), true);
});

test("ordinary Linux and unreadable /proc/version are unsupported", () => {
	assert.equal(isWindowsOrWSL("linux", {}, () => "Linux version 6.6.0-generic"), false);
	assert.equal(isWindowsOrWSL("linux", {}, missingProcVersion), false);
});

test("PowerShell single-quoted paths double embedded quotes", () => {
	assert.equal(escapePowerShellSingleQuoted("C:\\Users\\O'Brien\\image.png"), "C:\\Users\\O''Brien\\image.png");
});

test("PowerShell binary is selected by platform, not by the host running the tests", () => {
	assert.equal(powerShellBinary("win32"), "powershell");
	assert.equal(powerShellBinary("linux"), "powershell.exe");
});
