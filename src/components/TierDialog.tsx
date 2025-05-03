
import React from 'react';
import { tiers, TierType, saveUserTier } from '@/utils/photoUtils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface TierDialogProps {
  currentTier: TierType;
  onTierChange: (tier: TierType) => void;
}

const TierDialog: React.FC<TierDialogProps> = ({ currentTier, onTierChange }) => {
  const [open, setOpen] = React.useState(false);
  const [selectedTier, setSelectedTier] = React.useState<TierType>(currentTier);

  const handleTierChange = (tier: TierType) => {
    setSelectedTier(tier);
  };

  const handleSaveTier = () => {
    saveUserTier(selectedTier);
    onTierChange(selectedTier);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <span>{tiers[currentTier].name} Tier</span>
          <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
            {tiers[currentTier].maxPhotos} photos
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Your Tier</DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          <RadioGroup value={selectedTier} onValueChange={handleTierChange as (value: string) => void} className="space-y-4">
            {Object.values(tiers).map((tier) => (
              <div key={tier.type} className={`flex items-center space-x-2 p-4 rounded-lg border ${selectedTier === tier.type ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                <RadioGroupItem value={tier.type} id={tier.type} />
                <label htmlFor={tier.type} className="flex-grow cursor-pointer">
                  <div className="font-medium">{tier.name}</div>
                  <div className="text-sm text-gray-500">{tier.description}</div>
                </label>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {tier.maxPhotos} photos
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveTier} className="bg-google-blue hover:bg-blue-600">
            Save Tier
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TierDialog;

