import { useState } from "react";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ onMenuClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleSearch = (term) => {
    setSearchTerm(term);
    // In a real app, this would trigger a search across the current page
    console.log("Searching for:", term);
  };
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="lg:hidden"
            >
              <ApperIcon name="Menu" className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 font-display">
              ScholarHub
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:block w-96">
              <SearchBar 
                onSearch={handleSearch}
                placeholder="Search students, grades, or attendance..."
              />
            </div>
            
            <Button variant="ghost" size="sm">
              <ApperIcon name="Bell" className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="sm">
              <ApperIcon name="Settings" className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                Teacher
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;