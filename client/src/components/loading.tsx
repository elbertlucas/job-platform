import { Skeleton } from "./ui/skeleton"

function Loading() {
    return (
        <div className="w-screen grid h-screen place-items-center bg-gray-300 text-gray-800">
            <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        </div>
    )
}

export default Loading


