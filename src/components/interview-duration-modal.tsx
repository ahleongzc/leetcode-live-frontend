// components/InterviewDurationModal.tsx
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export function InterviewDurationModal({
    open,
    onClose,
    value,
    onChange,
    onSave,
}: {
    open: boolean;
    onClose: () => void;
    value: number;
    onChange: (val: number) => void;
    onSave: () => void;
}) {
    if (!open) return null;

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-40 pointer-events-auto">
            <div className="bg-white w-[90%] max-w-md max-h-[90%] overflow-y-auto p-6 rounded-lg shadow-lg relative pointer-events-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Edit Interview Details</h2>
                    <button
                        className="text-gray-500 hover:text-black"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                    Update the details for your interview session.
                </p>

                <Slider
                    value={[value]}
                    onValueChange={(val) => onChange(val[0])}
                    min={15}
                    max={40}
                    step={5}
                />

                <p className="text-sm mt-2">Current Interview duration: {value} minutes</p>

                <div className="flex justify-end gap-2 mt-6">
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={onSave}>Save</Button>
                </div>
            </div>
        </div>
    );
}
