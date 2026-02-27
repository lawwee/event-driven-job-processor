import dotenv from "dotenv";

dotenv.config();

const throwIfUndefined = (name: string, value: any) => {
    if (value === undefined) {
        throw new Error(`Environment variable ${name} is not defined`);
    };

    return value;
};

export const Environment = {
    PORT: process.env.PORT || "3000",
    DB_HOST: throwIfUndefined("DB_HOST", process.env.DB_HOST)
};