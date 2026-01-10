export function formatCountingNumber(number: number, locale = "en-US"): string {
    const formattedNumber = number.toLocaleString(locale);

    return formattedNumber;
}

export function formatToShortNumber(count: number, locale = "en-US"): string {
    // 0 - 999
    if (count < 1000) {
        return String(count);
    }

    // 1000 – 9999 => x,xxx
    if (count < 10000) {
        return count.toLocaleString(locale);
    }

    // 10000 – 999999 => xxk / xxxk
    if (count < 1000000) {
        return `${Math.floor(count / 1000)}k`;
    }

    // 1000000 – 9999999 => xM / x.xM
    if (count < 10000000) {
        const value = count / 1000000;
        return value % 1 === 0 ? `${value}M` : `${value.toFixed(1).replace(/\.0$/, "")}M`;
    }

    // 10000000+ => xxM
    return `${Math.floor(count / 1000000)}M`;
}
