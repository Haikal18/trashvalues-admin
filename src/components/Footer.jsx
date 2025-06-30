import { Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="bg-white border-t py-4 px-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-2 mb-2 md:mb-0">
          <div className="h-6 w-6 rounded bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-medium">
            T4C
          </div>
          <span>© {new Date().getFullYear()} Trash4Cash</span>
        </div>

        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-green-600 transition-colors">
            Support
          </a>
          <Separator orientation="vertical" className="h-4" />
          <a href="#" className="hover:text-green-600 transition-colors">
            Privacy
          </a>
          <Separator orientation="vertical" className="h-4" />
          <a href="#" className="hover:text-green-600 transition-colors">
            Terms
          </a>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="h-3 w-3 text-red-500 fill-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
