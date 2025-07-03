import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { insertProfileSchema } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useAccessibilityContext } from '@/components/accessibility-provider';
import { z } from 'zod';

const profileSetupSchema = insertProfileSchema.extend({
  interests: z.array(z.string()).min(1, 'Please select at least one interest'),
  accessibilityNeeds: z.array(z.string()),
  communicationPreferences: z.array(z.string()).min(1, 'Please select at least one communication preference'),
});

const interestOptions = [
  'Photography', 'Hiking', 'Travel', 'Music', 'Cooking', 'Programming',
  'Art', 'Reading', 'Gaming', 'Sports', 'Dancing', 'Movies', 'Gardening',
  'Volunteering', 'Yoga', 'Meditation', 'Writing', 'Crafts'
];

const accessibilityOptions = [
  'Wheelchair accessible venues', 'Ground floor access', 'Large print materials',
  'Sign language interpretation', 'Audio descriptions', 'Quiet environments',
  'Well-lit spaces', 'Simple language', 'Visual alerts', 'Tactile guidance'
];

const communicationOptions = [
  'Text messages', 'Voice calls', 'Video calls', 'Email', 'Sign language (ASL)',
  'Sign language (BSL)', 'Written notes', 'Voice messages'
];

const disabilityTypes = [
  'Visual', 'Hearing', 'Mobility', 'Cognitive', 'Chronic illness', 
  'Mental health', 'Learning disability', 'Multiple disabilities', 'Other'
];

export default function ProfileSetup() {
  const [step, setStep] = useState(1);
  const { announceToScreenReader } = useAccessibilityContext();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof profileSetupSchema>>({
    resolver: zodResolver(profileSetupSchema),
    defaultValues: {
      userId: 1, // This would come from auth context
      name: '',
      age: 18,
      location: '',
      bio: '',
      interests: [],
      disabilityType: '',
      accessibilityNeeds: [],
      communicationPreferences: [],
      photos: [],
      isActive: true,
    },
  });

  const createProfileMutation = useMutation({
    mutationFn: (data: z.infer<typeof profileSetupSchema>) => apiRequest('POST', '/api/profiles', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/profiles'] });
      announceToScreenReader('Profile created successfully');
    },
  });

  const onSubmit = (data: z.infer<typeof profileSetupSchema>) => {
    createProfileMutation.mutate(data);
  };

  const nextStep = () => {
    setStep(step + 1);
    announceToScreenReader(`Moving to step ${step + 1} of profile setup`);
  };

  const prevStep = () => {
    setStep(step - 1);
    announceToScreenReader(`Moving to step ${step - 1} of profile setup`);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create Your Profile</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground">Step {step} of 4</span>
          </div>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name and Age</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Alex, 28" {...field} />
                        </FormControl>
                        <FormDescription>
                          This will be displayed on your profile
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="18"
                            max="100"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., San Francisco, CA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about yourself, your interests, and what you're looking for..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Share your personality and what makes you unique
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Interests</h3>
                  
                  <FormField
                    control={form.control}
                    name="interests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What are you interested in?</FormLabel>
                        <FormDescription>
                          Select all that apply to help us find compatible matches
                        </FormDescription>
                        <div className="grid grid-cols-2 gap-3">
                          {interestOptions.map((interest) => (
                            <FormItem key={interest} className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(interest)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([...field.value, interest]);
                                    } else {
                                      field.onChange(field.value?.filter((value) => value !== interest));
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{interest}</FormLabel>
                            </FormItem>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Accessibility Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="disabilityType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Disability Type (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select if you'd like to share" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {disabilityTypes.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          This helps us match you with understanding partners
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="accessibilityNeeds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Accessibility Needs</FormLabel>
                        <FormDescription>
                          Help potential matches understand your accessibility requirements
                        </FormDescription>
                        <div className="grid grid-cols-1 gap-3">
                          {accessibilityOptions.map((need) => (
                            <FormItem key={need} className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(need)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([...field.value, need]);
                                    } else {
                                      field.onChange(field.value?.filter((value) => value !== need));
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{need}</FormLabel>
                            </FormItem>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Communication Preferences</h3>
                  
                  <FormField
                    control={form.control}
                    name="communicationPreferences"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>How do you prefer to communicate?</FormLabel>
                        <FormDescription>
                          Select your preferred communication methods
                        </FormDescription>
                        <div className="grid grid-cols-1 gap-3">
                          {communicationOptions.map((preference) => (
                            <FormItem key={preference} className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(preference)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([...field.value, preference]);
                                    } else {
                                      field.onChange(field.value?.filter((value) => value !== preference));
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{preference}</FormLabel>
                            </FormItem>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={step === 1}
                >
                  Previous
                </Button>
                {step < 4 ? (
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                ) : (
                  <Button type="submit" disabled={createProfileMutation.isPending}>
                    {createProfileMutation.isPending ? 'Creating Profile...' : 'Create Profile'}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
