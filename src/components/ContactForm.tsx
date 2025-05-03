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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

// Schema for form validation
const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  budget: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  terms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

type FormValues = z.infer<typeof formSchema>;

// Helper function to format currency
const formatCurrency = (value: string): string => {
  // Remove non-numeric characters except decimal point
  const numericValue = value.replace(/[^\d.]/g, '');
  
  // Handle decimal points correctly
  const parts = numericValue.split('.');
  
  // Format the whole number part with commas
  let formattedValue = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  // Add back decimal part if it exists
  if (parts.length > 1) {
    // Limit to 2 decimal places
    formattedValue += '.' + parts[1].slice(0, 2);
  }
  
  return formattedValue;
};

export default function ContactForm({ onClose }: { onClose?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formattedBudget, setFormattedBudget] = useState("");
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      budget: "",
      message: "",
      terms: false,
    },
  });

  // Watch budget field to update formatted display
  const budgetValue = form.watch("budget");
  
  // Update formatted budget display when budget value changes
  useEffect(() => {
    if (budgetValue) {
      setFormattedBudget(formatCurrency(budgetValue));
    } else {
      setFormattedBudget("");
    }
  }, [budgetValue]);

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || "Failed to send message");
      }

      toast.success("Message sent successfully! We'll be in touch soon.");
      form.reset();
      setFormattedBudget("");
      if (onClose) onClose();
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

        <div className="grid grid-cols-2 gap-4">
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
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type="text" 
                      inputMode="decimal" 
                      placeholder="Budget (optional)" 
                      className="pl-7"
                      value={formattedBudget}
                      onChange={(e) => {
                        // Extract just the numbers for the actual value
                        const rawValue = e.target.value.replace(/[^\d.]/g, '');
                        field.onChange(rawValue);
                      }}
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </div>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      AUD
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea 
                  placeholder="Your Message*" 
                  className="min-h-[120px] resize-none" 
                  {...field} 
                />
              </FormControl>
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
                I agree to the terms and conditions
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full py-7 font-medium" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}