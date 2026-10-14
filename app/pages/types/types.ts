export interface User {
    _id?: string;
    name: string;
    email: string;
    password?: string;
}

export interface Login {
    email: string;
    password: string;
}

export interface Note {
    _id: string;
    content: string;
}

export interface Notebook {
    _id: string;
    title: string;
    currentLeft: number;
    currentRight: number;
    content: Array<string>;
}

export interface GeneralInput {
    displayName: string;
    id: string;
    type: "text" | "email";
    required: boolean
}

export interface Password {
    displayName: string;
    id: string;
}