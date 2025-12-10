import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, ChevronLeft, ChevronRight, Upload, X, TreePine, Gift, Users, FileText } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Snowfall from '@/components/Snowfall';
import Stars from '@/components/Stars';
import ThemeToggle from '@/components/ThemeToggle';
import FileUpload from '@/components/FileUpload';
import Confetti from '@/components/Confetti';
import MusicPlayer from '@/components/MusicPlayer';
import SnowGlobe from '@/components/SnowGlobe';
import { playSuccessJingle } from '@/utils/sounds';
import { toast } from 'sonner';
import { useEffect } from 'react';

// Step schemas
const humanVerifySchema = z.object({
  isHuman: z.boolean().refine(val => val === true, 'Please verify you are human'),
});

const teamInfoSchema = z.object({
  teamName: z.string().min(3, 'Team name must be at least 3 characters').max(50),
  institutionName: z.string().min(2, 'Institution name is required'),
  numberOfMembers: z.string(),
  teamLeadName: z.string().min(2, 'Team lead name is required'),
  teamLeadEmail: z.string().email('Please enter a valid email'),
  teamLeadPhone: z.string().min(10, 'Please enter a valid phone number'),
});

const projectSchema = z.object({
  problemStatementId: z.string().min(1, 'Please select a problem statement'),
  projectTitle: z.string().min(5, 'Project title must be at least 5 characters').max(100),
  projectDescription: z.string().min(50, 'Description must be at least 50 characters').max(1000),
  techStack: z.string().min(1, 'Please select tech stack'),
});

type FormData = {
  isHuman: boolean;
  teamName: string;
  institutionName: string;
  numberOfMembers: string;
  teamLeadName: string;
  teamLeadEmail: string;
  teamLeadPhone: string;
  problemStatementId: string;
  projectTitle: string;
  projectDescription: string;
  techStack: string;
  members: Array<{ name: string; email: string; role: string }>;
  agreeTerms: boolean;
};

const Register = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<FormData>>({
    numberOfMembers: '2',
    members: [{ name: '', email: '', role: '' }, { name: '', email: '', role: '' }],
  });
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File | null }>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [snowGlobeActive, setSnowGlobeActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSnowGlobeActive(true);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { title: 'Verify', icon: CheckCircle, description: 'Human check' },
    { title: 'Team Info', icon: Users, description: 'Basic details' },
    { title: 'Members', icon: Users, description: 'Team details' },
    { title: 'Project', icon: FileText, description: 'Your idea' },
    { title: 'Review', icon: Gift, description: 'Submit' },
  ];

  const problemStatements = [
    { id: 'ai-ml', name: 'AI & Machine Learning' },
    { id: 'web3', name: 'Web3 & Blockchain' },
    { id: 'healthcare', name: 'Healthcare Innovation' },
    { id: 'sustainability', name: 'Sustainability & Climate' },
  ];

  const techStacks = [
    'React + Node.js',
    'Python + Django',
    'Flutter + Firebase',
    'Next.js + Supabase',
    'Vue + FastAPI',
    'Other',
  ];

  const memberRoles = ['Frontend Developer', 'Backend Developer', 'Full Stack', 'Designer', 'ML Engineer'];

  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    setShowConfetti(true);
    playSuccessJingle();
    toast.success('Registration submitted successfully!', {
      description: 'Check your email for confirmation.',
      icon: <TreePine className="w-5 h-5" />,
    });
    // Here you would send data to API
    console.log('Form data:', formData);
  };

  const handleFileUpload = (key: string, file: File | null) => {
    setUploadedFiles(prev => ({ ...prev, [key]: file }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-8">
            <TreePine className="w-20 h-20 mx-auto animate-bounce-gentle text-christmas-green" />
            <h3 className="text-2xl font-display font-semibold">
              Before we begin...
            </h3>
            <p className="text-muted-foreground">
              Please verify that you're a human (and not a sneaky elf!)
            </p>
            <div className="glass-card p-6 max-w-sm mx-auto">
              <div className="flex items-center gap-4">
                <Checkbox
                  id="human"
                  checked={formData.isHuman}
                  onCheckedChange={(checked) => updateFormData({ isHuman: checked as boolean })}
                  className="border-christmas-green data-[state=checked]:bg-christmas-green"
                />
                <Label htmlFor="human" className="text-lg cursor-pointer">
                  I'm not a robot (or an elf)
                </Label>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <TreePine className="w-12 h-12 mx-auto mb-2 text-christmas-green" />
              <h3 className="text-2xl font-display font-semibold">Team Information</h3>
              <p className="text-muted-foreground">Tell us about your team</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="teamName">Team Name *</Label>
                <Input
                  id="teamName"
                  placeholder="The Code Crusaders"
                  value={formData.teamName || ''}
                  onChange={(e) => updateFormData({ teamName: e.target.value })}
                  className="bg-muted border-border focus:border-christmas-gold"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="institution">Institution Name *</Label>
                <Input
                  id="institution"
                  placeholder="Your College/Organization"
                  value={formData.institutionName || ''}
                  onChange={(e) => updateFormData({ institutionName: e.target.value })}
                  className="bg-muted border-border focus:border-christmas-gold"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="members">Number of Members *</Label>
                <Select
                  value={formData.numberOfMembers}
                  onValueChange={(val) => {
                    const num = parseInt(val);
                    const members = Array(num).fill(null).map((_, i) => 
                      formData.members?.[i] || { name: '', email: '', role: '' }
                    );
                    updateFormData({ numberOfMembers: val, members });
                  }}
                >
                  <SelectTrigger className="bg-muted border-border">
                    <SelectValue placeholder="Select team size" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="2">2 Members</SelectItem>
                    <SelectItem value="3">3 Members</SelectItem>
                    <SelectItem value="4">4 Members</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="leadName">Team Lead Name *</Label>
                <Input
                  id="leadName"
                  placeholder="John Doe"
                  value={formData.teamLeadName || ''}
                  onChange={(e) => updateFormData({ teamLeadName: e.target.value })}
                  className="bg-muted border-border focus:border-christmas-gold"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="leadEmail">Team Lead Email *</Label>
                <Input
                  id="leadEmail"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.teamLeadEmail || ''}
                  onChange={(e) => updateFormData({ teamLeadEmail: e.target.value })}
                  className="bg-muted border-border focus:border-christmas-gold"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="leadPhone">Team Lead Phone *</Label>
                <Input
                  id="leadPhone"
                  placeholder="+91 98765 43210"
                  value={formData.teamLeadPhone || ''}
                  onChange={(e) => updateFormData({ teamLeadPhone: e.target.value })}
                  className="bg-muted border-border focus:border-christmas-gold"
                />
              </div>
            </div>

            <FileUpload
              label="Team Lead ID Card *"
              onFileSelect={(file) => handleFileUpload('leadId', file)}
              accept=".jpg,.jpeg,.png,.pdf"
              maxSize={5}
              existingFile={uploadedFiles.leadId}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Users className="w-12 h-12 mx-auto mb-2 text-christmas-gold" />
              <h3 className="text-2xl font-display font-semibold">Team Members</h3>
              <p className="text-muted-foreground">Add details for each team member</p>
            </div>

            {formData.members?.map((member, index) => (
              <div key={index} className="glass-card p-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Gift className="w-5 h-5 inline-block text-christmas-gold" />
                  <h4 className="font-display font-semibold">
                    {index === 0 ? 'Team Lead' : `Member ${index + 1}`}
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Name *</Label>
                    <Input
                      placeholder="Full Name"
                      value={member.name}
                      onChange={(e) => {
                        const newMembers = [...(formData.members || [])];
                        newMembers[index] = { ...newMembers[index], name: e.target.value };
                        updateFormData({ members: newMembers });
                      }}
                      className="bg-muted border-border focus:border-christmas-gold"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      value={member.email}
                      onChange={(e) => {
                        const newMembers = [...(formData.members || [])];
                        newMembers[index] = { ...newMembers[index], email: e.target.value };
                        updateFormData({ members: newMembers });
                      }}
                      className="bg-muted border-border focus:border-christmas-gold"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Role *</Label>
                    <Select
                      value={member.role}
                      onValueChange={(val) => {
                        const newMembers = [...(formData.members || [])];
                        newMembers[index] = { ...newMembers[index], role: val };
                        updateFormData({ members: newMembers });
                      }}
                    >
                      <SelectTrigger className="bg-muted border-border">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {memberRoles.map((role) => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="text-4xl mb-2">💡</div>
              <h3 className="text-2xl font-display font-semibold">Project Details</h3>
              <p className="text-muted-foreground">Tell us about your idea</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Problem Statement *</Label>
                <Select
                  value={formData.problemStatementId}
                  onValueChange={(val) => updateFormData({ problemStatementId: val })}
                >
                  <SelectTrigger className="bg-muted border-border">
                    <SelectValue placeholder="Select a track" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {problemStatements.map((ps) => (
                      <SelectItem key={ps.id} value={ps.id}>{ps.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectTitle">Project Title *</Label>
                <Input
                  id="projectTitle"
                  placeholder="Your amazing project name"
                  value={formData.projectTitle || ''}
                  onChange={(e) => updateFormData({ projectTitle: e.target.value })}
                  className="bg-muted border-border focus:border-christmas-gold"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Project Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project idea in detail... (min 50 characters)"
                  rows={5}
                  value={formData.projectDescription || ''}
                  onChange={(e) => updateFormData({ projectDescription: e.target.value })}
                  className="bg-muted border-border focus:border-christmas-gold resize-none"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {formData.projectDescription?.length || 0} / 1000 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label>Tech Stack *</Label>
                <Select
                  value={formData.techStack}
                  onValueChange={(val) => updateFormData({ techStack: val })}
                >
                  <SelectTrigger className="bg-muted border-border">
                    <SelectValue placeholder="Select primary tech stack" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {techStacks.map((tech) => (
                      <SelectItem key={tech} value={tech}>{tech}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Gift className="w-12 h-12 mx-auto mb-2 animate-bounce-gentle text-christmas-red" />
              <h3 className="text-2xl font-display font-semibold">Review & Submit</h3>
              <p className="text-muted-foreground">Verify your information before submitting</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h4 className="font-display font-semibold text-christmas-gold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" /> Team Info
                </h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Team Name:</span> {formData.teamName}</p>
                  <p><span className="text-muted-foreground">Institution:</span> {formData.institutionName}</p>
                  <p><span className="text-muted-foreground">Team Size:</span> {formData.numberOfMembers} members</p>
                  <p><span className="text-muted-foreground">Lead:</span> {formData.teamLeadName}</p>
                  <p><span className="text-muted-foreground">Email:</span> {formData.teamLeadEmail}</p>
                </div>
              </div>

              <div className="glass-card p-6">
                <h4 className="font-display font-semibold text-christmas-gold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Project Info
                </h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Track:</span> {problemStatements.find(ps => ps.id === formData.problemStatementId)?.name}</p>
                  <p><span className="text-muted-foreground">Title:</span> {formData.projectTitle}</p>
                  <p><span className="text-muted-foreground">Tech Stack:</span> {formData.techStack}</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h4 className="font-display font-semibold text-christmas-gold mb-4">Team Members</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.members?.map((member, index) => (
                  <div key={index} className="bg-muted/50 rounded-lg p-4">
                    <p className="font-medium">{member.name || 'Not provided'}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                    <p className="text-sm text-christmas-green">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-3 glass-card p-6">
              <Checkbox
                id="terms"
                checked={formData.agreeTerms}
                onCheckedChange={(checked) => updateFormData({ agreeTerms: checked as boolean })}
                className="mt-1 border-christmas-green data-[state=checked]:bg-christmas-green"
              />
              <Label htmlFor="terms" className="text-sm cursor-pointer">
                I agree to the <a href="#" className="text-christmas-gold hover:underline">Terms & Conditions</a> and <a href="#" className="text-christmas-gold hover:underline">Privacy Policy</a>. I confirm that all information provided is accurate.
              </Label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.isHuman;
      case 1:
        return formData.teamName && formData.institutionName && formData.teamLeadName && formData.teamLeadEmail && formData.teamLeadPhone;
      case 2:
        return formData.members?.every(m => m.name && m.email && m.role);
      case 3:
        return formData.problemStatementId && formData.projectTitle && (formData.projectDescription?.length || 0) >= 50 && formData.techStack;
      case 4:
        return formData.agreeTerms;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <Snowfall />
      <div className="dark:block hidden">
        <Stars />
      </div>
      <ThemeToggle />
      <MusicPlayer />
      <SnowGlobe active={snowGlobeActive} onComplete={() => setSnowGlobeActive(false)} />
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
      <Header />

      <main className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              {steps.map((step, index) => (
                <div key={step.title} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      index <= currentStep
                        ? 'bg-christmas-green text-white glow-green'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {index < currentStep ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`text-xs mt-2 hidden md:block ${
                    index <= currentStep ? 'text-christmas-gold' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-christmas-red via-christmas-gold to-christmas-green transition-all duration-500"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Form Card */}
          <div className="glass-card p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-christmas-red via-christmas-gold to-christmas-green" />
            
            {renderStep()}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="border-muted-foreground text-muted-foreground hover:bg-muted"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              {currentStep === steps.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed()}
                  className="bg-christmas-green hover:bg-christmas-green/90 text-white glow-green"
                >
                  <TreePine className="w-4 h-4 inline-block mr-2" /> Submit Registration
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="bg-christmas-red hover:bg-christmas-red/90 text-white"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
