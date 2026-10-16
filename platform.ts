export function isWindowsOrWSL(
	platform: string,
	env: Partial<Record<"WSL_DISTRO_NAME" | "WSL_INTEROP", string>>,
	readProcVersion: () => string,
): boolean {
	if (platform === "win32") return true;
	if (platform !== "linux") return false;
	if (env.WSL_DISTRO_NAME || env.WSL_INTEROP) return true;
	try {
		return /microsoft/i.test(readProcVersion());
	} catch {
		return false;
	}
}

export function escapePowerShellSingleQuoted(s: string): string {
	return s.replace(/'/g, "''");
}

export function powerShellBinary(platform: string): string {
	return platform === "win32" ? "powershell" : "powershell.exe";
}
