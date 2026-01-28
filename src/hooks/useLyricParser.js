import { useMemo } from 'react';

/**
 * Parse LRC formatted lyrics into structured data
 * LRC format: [mm:ss.xx]Lyric text
 * 
 * @param {string} lrcContent - Raw LRC formatted string
 * @returns {Array<{time: number, text: string, englishText: string, sinhalaText: string}>}
 */
export function useLyricParser(lrcContent) {
    const lyrics = useMemo(() => {
        if (!lrcContent) return [];

        const lines = lrcContent.trim().split('\n');
        const parsedLyrics = [];

        // Regex to match LRC timestamp format: [mm:ss.xx]
        const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2})\]/;

        for (const line of lines) {
            const match = line.match(timeRegex);
            if (!match) continue;

            const minutes = parseInt(match[1], 10);
            const seconds = parseInt(match[2], 10);
            const centiseconds = parseInt(match[3], 10);

            // Convert to total seconds
            const time = minutes * 60 + seconds + centiseconds / 100;

            // Extract the lyric text (everything after the timestamp)
            const text = line.replace(timeRegex, '').trim();
            if (!text) continue;

            // Split English and Sinhala text
            // Format: "English text (Sinhala text)"
            const parenthesisMatch = text.match(/^(.+?)\s*\((.+)\)$/);

            let englishText = text;
            let sinhalaText = '';

            if (parenthesisMatch) {
                englishText = parenthesisMatch[1].trim();
                sinhalaText = parenthesisMatch[2].trim();
            }

            parsedLyrics.push({
                time,
                text,
                englishText,
                sinhalaText
            });
        }

        // Sort by time (should already be sorted, but just in case)
        return parsedLyrics.sort((a, b) => a.time - b.time);
    }, [lrcContent]);

    return lyrics;
}
