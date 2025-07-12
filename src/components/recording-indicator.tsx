import { Mic } from 'lucide-react';

const RecordingIndicator = ({ size }: { size: number }) => {
    return (
        <div className="flex items-center text-sm font-medium text-red-600">
            <Mic className={`mr-2 animate-blink`} style={{ width: size, height: size }} />
        </div>
    );
};

export default RecordingIndicator;