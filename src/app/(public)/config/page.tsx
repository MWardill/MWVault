"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Sprite from "@/components/images/Sprite";
import Image from "next/image";
import { useState } from "react";
import { importCollectionFromCsv } from "@/lib/actions/collection";

export default function Config() {
    const { data: session, status } = useSession();
    const [isImporting, setIsImporting] = useState(false);
    const [importResult, setImportResult] = useState<{ success: boolean; message: string } | null>(null);

    async function handleImport(formData: FormData) {
        setIsImporting(true);
        setImportResult(null);

        const result = await importCollectionFromCsv(formData);

        setIsImporting(false);
        setImportResult({
            success: result.success,
            message: result.message ?? result.error ?? "An error occurred.",
        });
    }

    return (
        <div className="flex-1 flex flex-col w-full relative">
            <h1 className="text-xl md:text-2xl font-pixel text-white jrpg-text-shadow tracking-widest pl-2 pt-2 mb-6">
                System Config
            </h1>

            <div className="jrpg-panel flex flex-col gap-6 p-6 relative">
                <div className="flex flex-col gap-2">
                    <h2 className="text-lg font-pixel text-[#7fc0ff] jrpg-text-shadow">Authentication</h2>
                    <p className="text-sm font-pixel text-gray-300 leading-relaxed max-w-2xl">
                        Log in to manage the MW Vault. Access is strictly restricted to authorized administrators.
                    </p>
                </div>

                <div className="flex items-center gap-6 mt-4">
                    {status === "loading" ? (
                        <div className="text-gray-400 font-pixel animate-pulse">Checking status...</div>
                    ) : session ? (
                        <>
                            <div className="flex flex-col md:flex-row md:items-center gap-4 w-full justify-between">
                                <div className="flex items-center gap-4 bg-black/40 border border-[#7fc0ff]/30 p-3 rounded-md">
                                    {session.user?.image ? (
                                        <Image
                                            src={session.user.image}
                                            alt="Profile"
                                            width={40}
                                            height={40}
                                            className="w-10 h-10 rounded-full border-2 border-[#7fc0ff]"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full border-2 border-[#7fc0ff] bg-gray-700 flex items-center justify-center">
                                            <Sprite src="/sprites/mogWalkFront.gif" alt="User" width={32} height={32} />
                                        </div>
                                    )}
                                    <div className="flex flex-col">
                                        <span className="text-white font-pixel text-sm">{session.user?.name}</span>
                                        <span className="text-gray-400 font-pixel text-xs mt-1">{session.user?.email}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => signOut()}
                                    className="jrpg-button px-6 py-2 font-pixel text-sm hover:text-red-400 transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </>
                    ) : (
                        <button
                            onClick={() => signIn("google")}
                            className="jrpg-button px-6 py-3 font-pixel text-sm flex items-center gap-3 relative overflow-hidden group"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Connect Google Account
                            </span>
                        </button>
                    )}
                </div>
            </div>

            {session && (
                <div className="jrpg-panel flex flex-col gap-6 p-6 mt-6 relative">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-lg font-pixel text-[#7fc0ff] jrpg-text-shadow">Data Import</h2>
                        <p className="text-sm font-pixel text-gray-300 leading-relaxed max-w-2xl">
                            Upload a game collection CSV file to import records into the database. Dreamcast games will be parsed and upserted.
                        </p>
                    </div>

                    <form action={handleImport} className="flex flex-col sm:flex-row gap-4 items-end mt-4">
                        <div className="flex flex-col gap-2 flex-1">
                            <label htmlFor="csvFile" className="text-sm font-pixel text-gray-400">
                                Select CSV File
                            </label>
                            <input
                                type="file"
                                id="csvFile"
                                name="csvFile"
                                accept=".csv"
                                required
                                className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-pixel file:bg-[#7fc0ff]/20 file:text-[#7fc0ff] hover:file:bg-[#7fc0ff]/30 transition-colors file:cursor-pointer p-2 bg-black/40 border border-[#7fc0ff]/30 rounded-md"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isImporting}
                            className="jrpg-button px-6 py-2.5 font-pixel text-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            {isImporting ? "Importing..." : "Run Import"}
                        </button>
                    </form>

                    {importResult && (
                        <div className={`p-4 rounded-md font-pixel text-sm border ${importResult.success ? "bg-green-900/30 border-green-500/50 text-green-300" : "bg-red-900/30 border-red-500/50 text-red-300"}`}>
                            {importResult.message}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

