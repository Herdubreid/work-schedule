// Extending String prototype
interface String {
    format(...params: any[]): string;
    isNumber(): boolean;
    fromLocalISOString(): Date;
}
interface Date {
    jdeFormat(fmt: string, sep: string): string;
    toLocalISOString(): string;
    addDays(days: number): Date;
    addMonths(months: number, date?: number): Date;
}

// Variable number of params, mimicking C# params keyword
// params type is set to any so consumer can pass number
// or string, might be a better way to constraint types to
// string and number only using generic?
String.prototype.format = function (...params: any[]) {
    let s = this;
    let i = params.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), params[i]);
    }

    return s;
};
String.prototype.isNumber = function () {
    return /^[0-9]*$/.test(this);
};
String.prototype.fromLocalISOString = function () {
    const date = new Date(this);
    return new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours());
};
Date.prototype.jdeFormat = function (fmt: string, sep: string) {
    const s = '{0}' + sep + '{1}' + sep + '{2}';
    switch (fmt) {
        case 'DME':
        case 'DMY':
            return s.format(this.getDate(), this.getMonth() + 1, this.getFullYear());
        case 'EMD':
        case 'YMD':
            return s.format(this.getFullYear(), this.getMonth() + 1, this.getDate());
        case 'MDE':
        case 'MDY':
            return s.format(this.getMonth() + 1, this.getDate(), this.getFullYear());
    }
    return s.format(this.getDate(), this.getMonth() + 1, this.getFullYear());
};
Date.prototype.toLocalISOString = function () {
    return new Date(
        Date.UTC(
            this.getFullYear(),
            this.getMonth(),
            this.getDate(),
            this.getHours(),
            this.getMinutes(),
            this.getSeconds(),
            this.getMilliseconds())).toISOString();
};
Date.prototype.addDays = function (days: number) {
    return new Date(this.getTime() + (86400000 * days));
};
Date.prototype.addMonths = function (months: number, date: number = this.getDate()) {
    const dt = new Date(this);
    dt.setMonth(this.getMonth() + Number(months), date);
    return dt;
};
