import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Camera,
  Upload,
  User,
  MapPin,
  DollarSign,
  Languages,
  Briefcase,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

const categories = [
  "Singer",
  "Dancer",
  "DJ",
  "Speaker",
  "Comedian",
  "Band",
  "Magician",
];
const languages = [
  "English",
  "Hindi",
  "Tamil",
  "Telugu",
  "Bengali",
  "Marathi",
  "Gujarati",
];
const feeRanges = [
  "₹10K-25K",
  "₹25K-50K",
  "₹50K-1L",
  "₹1L-2L",
  "₹2L-5L",
  "₹5L+",
];

interface FormData {
  name: string;
  bio: string;
  categories: string[];
  languages: string[];
  feeRange: string;
  location: string;
  profileImage: File | null;
  phone: string;
  email: string;
  experience: string;
}

export default function OnboardingForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    bio: "",
    categories: [],
    languages: [],
    feeRange: "",
    location: "",
    profileImage: null,
    phone: "",
    email: "",
    experience: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState("");

  const steps = [
    {
      title: "Personal Info",
      icon: User,
      fields: ["name", "email", "phone", "location"],
    },
    {
      title: "Professional Details",
      icon: Briefcase,
      fields: ["categories", "experience", "feeRange"],
    },
    {
      title: "Additional Info",
      icon: Languages,
      fields: ["languages", "bio", "profileImage"],
    },
  ];

  const validateStep = (step: number) => {
    const newErrors: { [key: string]: string } = {};
    const currentFields = steps[step].fields;

    currentFields.forEach((field) => {
      if (field === "categories" && formData.categories.length === 0) {
        newErrors.categories = "Please select at least one category";
      } else if (field === "languages" && formData.languages.length === 0) {
        newErrors.languages = "Please select at least one language";
      } else if (field !== "profileImage" && field !== "bio") {
        const value = formData[field as keyof FormData];
        if (!value || (typeof value === "string" && value.trim() === "")) {
          newErrors[field] = `${
            field.charAt(0).toUpperCase() + field.slice(1)
          } is required`;
        }
      }
    });

    if (
      currentFields.includes("email") &&
      formData.email &&
      !/\S+@\S+\.\S+/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email";
    }

    if (
      currentFields.includes("phone") &&
      formData.phone &&
      !/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))
    ) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleInputChange = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleArrayToggle = (
    field: "categories" | "languages",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          profileImage: "Image size should be less than 5MB",
        }));
        return;
      }
      setFormData((prev) => ({ ...prev, profileImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    setIsSubmitting(true);

    try {
      let imagePath = "";

      // 1. Upload image (if exists)
      if (formData.profileImage) {
        const uploadRes = await api.uploadImage(formData.profileImage);
        imagePath = uploadRes.path;
      }

      // 2. Prepare artist payload
      const artistPayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        category: formData.categories[0],
        priceRange: formData.feeRange,
        bio: formData.bio,
        languages: formData.languages,
        categories: formData.categories,
        experience: formData.experience,
        image: imagePath || "/placeholder.jpg",
      };

      // 3. Submit to backend
      await api.createArtist(artistPayload);

      setSuccessMessage(
        "Your profile has been submitted successfully! Redirecting..."
      );
      setTimeout(() => {
        router.push("/artists");
      }, 2000);
    } catch (err) {
      console.error("Submission failed:", err);
      setErrors({ submit: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successMessage) {
    return (
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Success!
        </h2>
        <p className="text-gray-600 dark:text-gray-300">{successMessage}</p>
      </div>
    );
  }

  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              index <= currentStep
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                : "bg-gray-200 dark:bg-gray-700 text-gray-500"
            }`}
          >
            <step.icon className="w-5 h-5" />
          </div>
          <div className="ml-3 hidden sm:block">
            <div
              className={`text-sm font-medium ${
                index <= currentStep ? "text-purple-600" : "text-gray-500"
              }`}
            >
              {step.title}
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-12 h-0.5 mx-4 ${
                index < currentStep
                  ? "bg-gradient-to-r from-purple-600 to-blue-600"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Full Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your full name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address *
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="your.email@example.com"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number *
              </label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter your phone number"
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Location *
              </label>
              <Input
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="City, State"
                className={errors.location ? "border-red-500" : ""}
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <Briefcase className="w-4 h-4 inline mr-2" />
                Categories * (Select all that apply)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleArrayToggle("categories", category)}
                    className={`p-3 rounded-xl border-2 transition-all duration-300 text-sm font-medium ${
                      formData.categories.includes(category)
                        ? "border-purple-600 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
                        : "border-gray-200 dark:border-gray-700 hover:border-purple-300 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              {errors.categories && (
                <p className="text-red-500 text-sm mt-2">{errors.categories}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Years of Experience *
              </label>
              <select
                value={formData.experience}
                onChange={(e) =>
                  handleInputChange("experience", e.target.value)
                }
                className={`w-full p-3 rounded-xl border-2 bg-white dark:bg-gray-800 ${
                  errors.experience
                    ? "border-red-500"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <option value="">Select experience</option>
                <option value="0-1">0-1 years</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5-10">5-10 years</option>
                <option value="10+">10+ years</option>
              </select>
              {errors.experience && (
                <p className="text-red-500 text-sm mt-1">{errors.experience}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Fee Range *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {feeRanges.map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => handleInputChange("feeRange", range)}
                    className={`p-3 rounded-xl border-2 transition-all duration-300 text-sm font-medium ${
                      formData.feeRange === range
                        ? "border-purple-600 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
                        : "border-gray-200 dark:border-gray-700 hover:border-purple-300 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
              {errors.feeRange && (
                <p className="text-red-500 text-sm mt-2">{errors.feeRange}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <Languages className="w-4 h-4 inline mr-2" />
                Languages * (Select all you speak)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {languages.map((language) => (
                  <button
                    key={language}
                    type="button"
                    onClick={() => handleArrayToggle("languages", language)}
                    className={`p-3 rounded-xl border-2 transition-all duration-300 text-sm font-medium ${
                      formData.languages.includes(language)
                        ? "border-purple-600 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
                        : "border-gray-200 dark:border-gray-700 hover:border-purple-300 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {language}
                  </button>
                ))}
              </div>
              {errors.languages && (
                <p className="text-red-500 text-sm mt-2">{errors.languages}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio (Tell us about yourself)
              </label>
              <Textarea
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Share your story, achievements, and what makes you unique..."
                rows={4}
                className="resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Camera className="w-4 h-4 inline mr-2" />
                Profile Image
              </label>
              <div className="flex items-center space-x-4">
                {imagePreview ? (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">Upload Image</span>
                    </div>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">Max 5MB, JPG/PNG</p>
                </div>
              </div>
              {errors.profileImage && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.profileImage}
                </p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Join Artistly
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Share your talent with the world
            </p>
          </div>

          <StepIndicator />

          <div className="mb-8">{renderStep()}</div>

          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-red-700 text-sm">{errors.submit}</span>
            </div>
          )}

          <div className="flex justify-between">
            <Button
              onClick={handlePrev}
              disabled={currentStep === 0}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center space-x-2"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center space-x-2 min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Submit</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
