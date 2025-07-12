export const ScrollContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="h-full overflow-y-auto no-scrollbar">
            <div className="p-4">
                {children}
            </div>
        </div>
    );
};
