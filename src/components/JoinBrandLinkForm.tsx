"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";

// Schema for form validation - split into steps
const step1Schema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
});

const step2Schema = z.object({
  instagram: z.string().min(3, "Please enter your Instagram handle").optional(),
  tiktok: z.string().optional(),
  youtube: z.string().optional(),
  followers: z.string().min(1, "Please specify your follower count"),
  niche: z.string().min(1, "Please select your content niche"),
});

const step3Schema = z.object({
  about: z.string().min(10, "Please tell us more about yourself").max(500, "Maximum 500 characters"),
  terms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

// Combined schema for the entire form
const formSchema = step1Schema.merge(step2Schema).merge(step3Schema);

type FormValues = z.infer<typeof formSchema>;

const formatFollowerCount = (value: string): string => {
  // Remove non-numeric characters
  const numericValue = value.replace(/[^\d]/g, '');
  
  // Format with commas
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const contentNiches = [
  "Fashion & Style",
  "Beauty & Skincare",
  "Fitness & Wellness",
  "Travel & Adventure",
  "Food & Cooking",
  "Lifestyle",
  "Tech & Gaming",
  "Business & Finance",
  "Parenting & Family",
  "Pets & Animals",
  "Entertainment",
  "Education",
  "Arts & Crafts",
  "Home Decor",
  "Sports",
  "Comedy & Humor",
  "Music",
  "Automotive",
  "Other"
];

export default function JoinBrandLinkForm({ onClose }: { onClose?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formattedFollowers, setFormattedFollowers] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      instagram: "",
      tiktok: "",
      youtube: "",
      followers: "",
      niche: "",
      about: "",
      terms: false,
    },
    mode: "onChange",
  });

  // Watch followers field to update formatted display
  const followersValue = form.watch("followers");
  
  useEffect(() => {
    if (followersValue) {
      setFormattedFollowers(formatFollowerCount(followersValue));
    } else {
      setFormattedFollowers("");
    }
  }, [followersValue]);

  // Function to handle step transitions
  const handleNext = async () => {
    let isValid = false;
    
    // Validate fields based on current step
    if (currentStep === 1) {
      isValid = await form.trigger(['firstName', 'lastName', 'email', 'phone']);
    } else if (currentStep === 2) {
      isValid = await form.trigger(['instagram', 'followers', 'niche']);
    }
    
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
      window.scrollTo(0, 0);
    }
  };
  
  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/join-influencer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || "Failed to submit application");
      }

      // Show success state instead of closing immediately
      setIsComplete(true);
      form.reset();
      setFormattedFollowers("");
      
      // Don't close the dialog immediately
      // This line is removed: if (onClose) onClose();
      
    } catch (error) {
      toast.error("Failed to submit application. Please try again.");
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Success screen component
  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <h3 className="text-2xl font-bold">Application Submitted!</h3>
        <p className="text-muted-foreground">
          Thank you for applying to join Brand Link. Our team will review your application and get back to you soon.
        </p>
        <Button onClick={onClose} className="mt-6">
          Close
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Step indicator */}
        <div className="flex justify-between items-center mb-6">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= step 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step}
              </div>
              <span className="text-xs mt-1">
                {step === 1 ? 'Basic Info' : step === 2 ? 'Social Media' : 'About You'}
              </span>
            </div>
          ))}
        </div>

        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="First Name*" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Last Name*" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="Email Address*" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      type="tel" 
                      inputMode="numeric" 
                      placeholder="Phone Number*" 
                      {...field}
                      onChange={(e) => {
                        // Allow only numbers, spaces, and common phone separators
                        const value = e.target.value.replace(/[^\d\s()-+]/g, '');
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="button" 
              className="w-full py-7 font-medium mt-6" 
              onClick={handleNext}
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </>
        )}

        {/* Step 2: Social Media */}
        {currentStep === 2 && (
          <>
            <FormLabel className="text-sm font-medium mt-2 block">Social Media Handles</FormLabel>
            <FormDescription className="text-xs text-muted-foreground -mt-1 mb-2">
              At least one social media account is required
            </FormDescription>
            
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        @
                      </div>
                      <FormControl>
                        <Input 
                          placeholder="Instagram handle" 
                          className="pl-8"
                          {...field} 
                          onChange={(e) => {
                            // Remove @ if user adds it
                            const value = e.target.value.replace('@', '');
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tiktok"
                render={({ field }) => (
                  <FormItem>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        @
                      </div>
                      <FormControl>
                        <Input 
                          placeholder="TikTok handle (optional)" 
                          className="pl-8"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.replace('@', '');
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="youtube"
                render={({ field }) => (
                  <FormItem>
                    <div className="relative">
                      <FormControl>
                        <Input 
                          placeholder="YouTube channel name (optional)" 
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="followers"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="text" 
                          inputMode="numeric" 
                          placeholder="Total followers*" 
                          value={formattedFollowers}
                          onChange={(e) => {
                            // Extract just the numbers for the actual value
                            const rawValue = e.target.value.replace(/[^\d]/g, '');
                            field.onChange(rawValue);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="niche"
                render={({ field }) => (
                  <FormItem>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Content niche*" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {contentNiches.map(niche => (
                          <SelectItem key={niche} value={niche}>{niche}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-between gap-3 mt-6">
              <Button 
                type="button" 
                variant="outline"
                className="py-7 font-medium flex-1" 
                onClick={handlePrevious}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button 
                type="button" 
                className="py-7 font-medium flex-1" 
                onClick={handleNext}
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        )}

        {/* Step 3: About You and Submission */}
        {currentStep === 3 && (
          <>
            {/* Add a heading similar to step 2 for consistency */}
            <FormLabel className="text-sm font-medium mt-2 block">About You</FormLabel>
            <FormDescription className="text-xs text-muted-foreground -mt-1 mb-2">
              Tell us more about your content and audience
            </FormDescription>
            
            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us about yourself, your content style, and your audience..." 
                      className="min-h-[160px] resize-none" // Increased height
                      {...field}
                      maxLength={500}
                    />
                  </FormControl>
                  <div className="flex justify-end">
                    <span className="text-xs text-muted-foreground">
                      {field.value.length}/500
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                  <FormControl>
                    <Checkbox 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="text-sm leading-none">
                    I agree to the terms and conditions and privacy policy. I understand that my information
                    will be used as described.
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-between gap-3 mt-6">
              <Button 
                type="button" 
                variant="outline"
                className="py-7 font-medium flex-1" 
                onClick={handlePrevious}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button 
                type="submit" 
                className="py-7 font-medium flex-1" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Apply to Join"}
              </Button>
            </div>
          </>
        )}
      </form>
    </Form>
  );
}