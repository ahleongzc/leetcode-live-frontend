import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

export function LogoutDialog({
    open,
    onOpenChange,
    onConfirm,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}) {
    return (
        <AlertDialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
            <AlertDialogPrimitive.Content className="absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-[calc(100%-2rem)] max-w-md">
                <AlertDialogPrimitive.Title className="text-lg font-bold">
                    Are you sure?
                </AlertDialogPrimitive.Title>
                <AlertDialogPrimitive.Description className="text-sm text-gray-500 mt-2">
                    You will be logged out of the session.
                </AlertDialogPrimitive.Description>
                <div className="flex justify-end space-x-4 mt-6">
                    <AlertDialogPrimitive.Cancel asChild>
                        <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                    </AlertDialogPrimitive.Cancel>
                    <AlertDialogPrimitive.Action asChild>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Log out
                        </button>
                    </AlertDialogPrimitive.Action>
                </div>
            </AlertDialogPrimitive.Content>
        </AlertDialogPrimitive.Root>
    );
}
