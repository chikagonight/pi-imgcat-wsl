export function isWindowsOrWSL(
	platform: string,
	env: Partial<Record<"WSL_DISTRO_NAME" | "WSL_INTEROP", string>>,
	readProcVersion: () => string,
): boolean {
	if (platform === "win32") return true;
	if (env.WSL_DISTRO_NAME !== undefined || env.WSL_INTEROP !== undefined) return true;
	if (platform !== "linux") return false;
	try {
		return /microsoft/i.test(readProcVersion());
	} catch {
		return false;
	}
}

export function powerShellBinary(platform: string): string {
	return platform === "win32" ? "powershell" : "powershell.exe";
}
