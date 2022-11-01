declare module 'mockjs' {
    interface MockjsRandom {
        constellation(): string;
        jwt(): string;
        sn(): string;
    }
}
export {};
