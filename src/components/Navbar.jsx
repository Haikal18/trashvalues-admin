import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, User, Settings, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import logo from "../assets/TrashValues.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Navbar({ isMobileView }) {
  const { logout, getCurrentUser } = useAuth();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b shadow-sm">
      <div className="h-[60px] px-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 flex items-center justify-center">
              <img 
                src={logo} 
                alt="TrashValues Logo" 
                className="h-10 w-10 object-contain"
              />
            </div>
            {!isMobileView && (
              <h1 className="text-lg font-medium">TrashValues</h1>
            )}
          </div>

          {!isMobileView && (
            <>
              <Separator orientation="vertical" className="mx-4 h-6" />

            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-600">
                  <Bell className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <div className="h-7 w-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || "A"}
                </div>
                {!isMobileView && (
                  <span className="text-sm">
                    {user?.email || user?.name || "Admin"}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-500 focus:text-red-500"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
