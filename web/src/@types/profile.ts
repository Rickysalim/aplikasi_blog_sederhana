export type Profile = {
    id: number;
    fullname: string;
    image: string | File;
    phone_number: string;
    email: string;
    afterSubmit? : string
}

export type ProfileState = {
    isLoading: boolean;
    profileState: Profile;
}

