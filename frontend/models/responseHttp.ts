import React from "react";

export interface IMeta {
    page: number;
    limit: number;
    count: number;
}

export interface IResponse<T> {
    message: string;
    status_code: number;
    data?: T;
    error?: {};
    meta?: IMeta
}