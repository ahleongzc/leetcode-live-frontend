import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Pencil, LogOut } from "lucide-react";
import { storage } from "@/utils/storage";
import { Dock } from "@/components/dock-bar";
import { Button } from "@/components/ui/button";
import { LogoutDialog } from "@/components/logout-dialog";
import { InterviewDurationModal } from "@/components/interview-duration-modal";
import { ProfileCard } from "@/components/profile-card";
import userAPIs from "@/api/user-api";
import authAPIs from "@/api/auth-api";

import {
    DEFAULT_PAGE_WIDTH,
    DEFAULT_PAGE_HEIGHT,
    type UserProfile
} from "@/types";

export default function ProfilePage({
    onResize,
    setShouldShowNavbar,
}: {
    onResize: (width: number, height: number) => void;
    setShouldShowNavbar: (value: boolean) => void;
}) {
    const [interviewDurationMin, setInterviewDurationMin] = useState(0);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const {
        data: userProfile = null,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["userProfile"],
        queryFn: async (): Promise<UserProfile> => {
            const sessionToken = await storage.getSessionToken();
            const responseBody = await userAPIs.userProfileData(sessionToken);
            setInterviewDurationMin(responseBody.data.user.interview_duration_s / 60);
            return responseBody.data.user;
        },
    });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            const sessionToken = await storage.getSessionToken();
            await authAPIs.logout(sessionToken);
        },
        onSuccess: () => {
            window.location.hash = "#/login";
        },
        onError: () => {
            window.location.hash = "#/login";
        },
    });

    useEffect(() => {
        onResize(DEFAULT_PAGE_WIDTH, DEFAULT_PAGE_HEIGHT);
    }, []);

    useEffect(() => {
        setShouldShowNavbar(!logoutDialogOpen && !editDialogOpen);
    }, [logoutDialogOpen, editDialogOpen]);

    if (isLoading) return <div className="center">Loading...</div>;
    if (isError) return <div className="center text-red-500">Error: {error?.message}</div>;

    return (
        <>
            {logoutDialogOpen && <div className="absolute inset-0 bg-white bg-opacity-10 z-40" />}
            <div className="flex flex-col items-center justify-center h-full w-full bg-white p-6">
                <LogoutDialog
                    open={logoutDialogOpen}
                    onOpenChange={setLogoutDialogOpen}
                    onConfirm={() => logoutMutation.mutate()}
                />

                <ProfileCard
                    username={userProfile?.username || "Guest"}
                    email={userProfile?.email || "Not provided"}
                />

                <div className="flex flex-row items-center w-full h-full">
                    <div className="border rounded-[20px] text-center w-full max-w-md h-3/4 p-4 bg-red-300 m-2">
                        <h1 className="text-m font-bold">Remaining Interview Count</h1>
                        <p className="text-sm">{userProfile?.remaining_interview_count}</p>
                    </div>

                    <div className="border rounded-[20px] text-center w-full max-w-md h-3/4 p-4 bg-red-300 m-2">
                        <h1 className="text-m font-bold">Interview Duration (min)</h1>
                        <p className="text-sm">{interviewDurationMin}</p>
                        <Button onClick={() => setEditDialogOpen(true)}>
                            <Pencil />
                        </Button>
                    </div>
                </div>

                <InterviewDurationModal
                    open={editDialogOpen}
                    onClose={() => setEditDialogOpen(false)}
                    value={interviewDurationMin}
                    onChange={setInterviewDurationMin}
                    onSave={() => {
                        // handle API call to save the value here
                        setEditDialogOpen(false);
                    }}
                />

                <Dock
                    items={[
                        {
                            icon: <LogOut size={18} />,
                            label: "Log out",
                            onClick: () => setLogoutDialogOpen(true),
                        },
                    ]}
                    panelHeight={68}
                    baseItemSize={50}
                    magnification={70}
                />
            </div>
        </>
    );
}
