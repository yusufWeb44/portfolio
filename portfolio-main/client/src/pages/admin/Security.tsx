import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  ShieldCheck, Lock, Smartphone, KeyRound, Check, AlertCircle, 
  Eye, EyeOff, Loader2, Copy, CheckCircle2, QrCode, ShieldAlert,
  Mail
} from 'lucide-react';
import api from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

interface SecurityStatusData {
  email: string;
  isTwoFactorEnabled: boolean;
  updatedAt: string;
}

interface TwoFactorSetupData {
  secret: string;
  formattedSecret: string;
  qrCode: string;
  otpauth: string;
}

const Security = () => {
  const { currentLang, currentDirection } = useLanguage();
  const { user, setUser } = useAuthStore();
  const isAr = currentLang === 'ar';

  // Security Status State
  const [status, setStatus] = useState<SecurityStatusData | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  // 2FA Setup Flow State
  const [setupData, setSetupData] = useState<TwoFactorSetupData | null>(null);
  const [loadingSetup, setLoadingSetup] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [activating2FA, setActivating2FA] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // Disable 2FA Modal
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');
  const [disableCode, setDisableCode] = useState('');
  const [disabling2FA, setDisabling2FA] = useState(false);

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordTotpCode, setPasswordTotpCode] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submittingPassword, setSubmittingPassword] = useState(false);

  // Update Email Form State
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [emailTotpCode, setEmailTotpCode] = useState('');
  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const [submittingEmail, setSubmittingEmail] = useState(false);

  // Feedback Notification
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch initial security status
  const fetchStatus = async () => {
    try {
      setLoadingStatus(true);
      const res = await api.get('/auth/security-status');
      if (res.data?.success && res.data?.data) {
        setStatus(res.data.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch security status:', err);
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // Password Strength Meter
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score, label: isAr ? 'ضعيفة' : 'Weak', color: 'bg-red-500 text-red-500' };
    if (score <= 4) return { score, label: isAr ? 'متوسطة' : 'Moderate', color: 'bg-amber-500 text-amber-500' };
    return { score, label: isAr ? 'قوية جداً ومحمية' : 'Very Strong', color: 'bg-emerald-500 text-emerald-500' };
  };

  const strength = getPasswordStrength(newPassword);

  // Initiate 2FA Setup
  const handleStartSetup = async () => {
    try {
      setLoadingSetup(true);
      setFeedback(null);
      const res = await api.post('/auth/setup-2fa');
      if (res.data?.success) {
        setSetupData(res.data);
        setShowSetupModal(true);
        setVerificationCode('');
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || (isAr ? 'فشل بدء إعداد المصادقة' : 'Failed to initiate 2FA setup'),
      });
    } finally {
      setLoadingSetup(false);
    }
  };

  // Confirm & Activate 2FA
  const handleActivate2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.trim().length !== 6) return;

    try {
      setActivating2FA(true);
      setFeedback(null);
      const res = await api.post('/auth/enable-2fa', { token: verificationCode.trim() });
      if (res.data?.success) {
        setFeedback({
          type: 'success',
          text: isAr ? 'تم تفعيل Google Authenticator بنجاح! حسابك محمي بالكامل.' : 'Google Authenticator 2FA activated successfully!',
        });
        setShowSetupModal(false);
        setSetupData(null);
        setVerificationCode('');
        fetchStatus();
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || (isAr ? 'رمز التحقق غير صحيح، يرجى المحاولة ثانية' : 'Invalid 6-digit code'),
      });
    } finally {
      setActivating2FA(false);
    }
  };

  // Disable 2FA
  const handleDisable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disablePassword || disableCode.trim().length !== 6) return;

    try {
      setDisabling2FA(true);
      setFeedback(null);
      const res = await api.post('/auth/disable-2fa', {
        currentPassword: disablePassword,
        token: disableCode.trim(),
      });
      if (res.data?.success) {
        setFeedback({
          type: 'success',
          text: isAr ? 'تم إلغاء تفعيل المصادقة الثنائية.' : 'Google Authenticator 2FA has been disabled.',
        });
        setShowDisableModal(false);
        setDisablePassword('');
        setDisableCode('');
        fetchStatus();
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || (isAr ? 'فشل إلغاء التفعيل، تأكد من كلمة المرور والرمز' : 'Failed to disable 2FA'),
      });
    } finally {
      setDisabling2FA(false);
    }
  };

  // Change Password Submission
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (newPassword !== confirmPassword) {
      setFeedback({
        type: 'error',
        text: isAr ? 'كلمة المرور الجديدة غير متطابقة مع التأكيد' : 'New password and confirmation do not match',
      });
      return;
    }

    if (newPassword.length < 8) {
      setFeedback({
        type: 'error',
        text: isAr ? 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل' : 'New password must be at least 8 characters',
      });
      return;
    }

    if (status?.isTwoFactorEnabled && passwordTotpCode.trim().length !== 6) {
      setFeedback({
        type: 'error',
        text: isAr ? 'يرجى إدخال رمز Google Authenticator المكون من 6 أرقام من هاتفك' : 'Please enter the 6-digit code from Google Authenticator',
      });
      return;
    }

    setSubmittingPassword(true);
    try {
      const res = await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
        totpCode: passwordTotpCode.trim() || '000000',
      });

      if (res.data?.success) {
        if (res.data?.token) {
          localStorage.setItem('admin_token', res.data.token);
        }
        setFeedback({
          type: 'success',
          text: isAr ? 'تم تحديث كلمة المرور وتأمين حسابك بنجاح!' : 'Password successfully updated and secured!',
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordTotpCode('');
        fetchStatus();
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || (isAr ? 'حدث خطأ أثناء تحديث كلمة المرور' : 'Failed to update password'),
      });
    } finally {
      setSubmittingPassword(false);
    }
  };

  // Update Admin Email Submission
  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const cleanEmail = newEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setFeedback({
        type: 'error',
        text: isAr ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email address',
      });
      return;
    }

    if (cleanEmail === status?.email?.toLowerCase()) {
      setFeedback({
        type: 'error',
        text: isAr ? 'البريد الإلكتروني الجديد مطابق للبريد الحالي' : 'New email cannot be the same as current email',
      });
      return;
    }

    if (!emailPassword) {
      setFeedback({
        type: 'error',
        text: isAr ? 'يرجى إدخال كلمة المرور الحالية لتأكيد الهوية' : 'Current password is required to verify identity',
      });
      return;
    }

    if (status?.isTwoFactorEnabled && emailTotpCode.trim().length !== 6) {
      setFeedback({
        type: 'error',
        text: isAr ? 'يرجى إدخال رمز Google Authenticator المكون من 6 أرقام' : 'Please enter the 6-digit Google Authenticator code',
      });
      return;
    }

    setSubmittingEmail(true);
    try {
      const res = await api.post('/auth/update-email', {
        newEmail: cleanEmail,
        currentPassword: emailPassword,
        ...(status?.isTwoFactorEnabled ? { totpCode: emailTotpCode.trim() } : {}),
      });

      if (res.data?.success) {
        if (user) {
          setUser({ ...user, email: cleanEmail });
        }
        setFeedback({
          type: 'success',
          text: isAr ? `تم تحديث البريد الإلكتروني للمدير بنجاح إلى: ${cleanEmail}` : `Admin email updated successfully to: ${cleanEmail}`,
        });
        setNewEmail('');
        setEmailPassword('');
        setEmailTotpCode('');
        fetchStatus();
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || (isAr ? 'فشل تحديث البريد الإلكتروني' : 'Failed to update email'),
      });
    } finally {
      setSubmittingEmail(false);
    }
  };

  const copySecret = () => {
    if (setupData?.secret) {
      navigator.clipboard.writeText(setupData.secret);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2500);
    }
  };

  if (loadingStatus && !status) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        <span className="text-xs text-muted-foreground font-mono">
          {isAr ? 'جاري تحميل إعدادات الأمان...' : 'Loading security parameters...'}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8" dir={currentDirection}>
      <Helmet>
        <title>{isAr ? 'الأمان وإدارة الحساب | Yusuf CMS' : 'Security & Credentials | Yusuf CMS'}</title>
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="text-emerald-500" size={24} />
            <h1 className="text-2xl font-bold tracking-tight">
              {isAr ? 'مركز الأمان وإدارة الحساب (Google 2FA)' : 'Security & Account Center (Google 2FA)'}
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {isAr 
              ? 'تحكم كامل بكلمة المرور والبريد الإلكتروني الإداري وتفعيل المصادقة الثنائية مجاناً 100% مدى الحياة.' 
              : 'Full control over admin email, master password, and offline RFC 6238 two-factor authentication.'}
          </p>
        </div>

        {/* Status Badge */}
        <div>
          {status?.isTwoFactorEnabled ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {isAr ? 'المصادقة الثنائية مفعلة ونشطة' : 'Google 2FA Active & Protected'}
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              {isAr ? 'المصادقة الثنائية غير مفعلة' : 'Google 2FA Inactive'}
            </div>
          )}
        </div>
      </div>

      {/* Notification Toast Banner */}
      {feedback && (
        <div 
          className={`p-4 rounded-xl border flex items-center gap-3 animate-in fade-in duration-200 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-destructive/10 border-destructive/30 text-destructive'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle2 size={18} className="shrink-0" /> : <AlertCircle size={18} className="shrink-0" />}
          <p className="text-sm font-medium">{feedback.text}</p>
        </div>
      )}

      {/* Top Grid: 2FA Status Card + Credentials Meta */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Google Authenticator Card */}
        <div className="md:col-span-2 bg-card border border-border/80 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-foreground text-background flex items-center justify-center shrink-0 shadow-md">
                <Smartphone size={24} />
              </div>
              <div>
                <h2 className="text-base font-bold">Google Authenticator (2FA)</h2>
                <p className="text-xs text-muted-foreground">
                  {isAr ? 'رمز يتجدد كل 30 ثانية على هاتفك بدون إنترنت ومجاني 100% للأبد' : 'Time-based rolling 6-digit codes. 100% free, offline, zero carrier dependencies'}
                </p>
              </div>
            </div>

            {status?.isTwoFactorEnabled ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDisableModal(true)}
                className="text-destructive border-destructive/30 hover:bg-destructive/10 text-xs shrink-0"
              >
                {isAr ? 'إلغاء التفعيل' : 'Disable 2FA'}
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleStartSetup}
                disabled={loadingSetup}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shrink-0 shadow-sm"
              >
                {loadingSetup ? (
                  <>
                    <Loader2 size={14} className="animate-spin mr-1.5" />
                    {isAr ? 'جاري التحضير...' : 'Preparing...'}
                  </>
                ) : (
                  <>
                    <QrCode size={14} className={isAr ? 'ml-1.5' : 'mr-1.5'} />
                    {isAr ? 'تفعيل Google Authenticator الآن' : 'Enable Google 2FA Now'}
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="pt-4 border-t border-border/50 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/40">
              <p className="text-muted-foreground mb-1">{isAr ? 'المعيار الأمني' : 'Security Standard'}</p>
              <p className="font-mono font-bold text-foreground">RFC 6238 TOTP (Offline)</p>
            </div>
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/40">
              <p className="text-muted-foreground mb-1">{isAr ? 'التكلفة والرسوم' : 'Cost & Fees'}</p>
              <p className="font-semibold text-emerald-500">{isAr ? 'مجاني 100% مدى الحياة بدون شريحة SMS' : '100% Free Forever (Zero SMS Fees)'}</p>
            </div>
          </div>
        </div>

        {/* Security Overview Meta */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <KeyRound size={17} className="text-emerald-500" />
              <h3 className="text-sm font-bold">{isAr ? 'بيانات الحساب الحالي' : 'Active Account Identity'}</h3>
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-muted-foreground block">{isAr ? 'البريد الإلكتروني المعتمد:' : 'Current Admin Email:'}</span>
                <span className="font-mono font-semibold text-foreground text-xs sm:text-sm break-all">{status?.email}</span>
              </div>
              <div className="pt-2 border-t border-border/40">
                <span className="text-muted-foreground block">{isAr ? 'آخر تحديث للبيانات:' : 'Last Updated:'}</span>
                <span className="font-mono text-muted-foreground">
                  {status?.updatedAt ? new Date(status.updatedAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400">
            {isAr 
              ? 'التشفير بـ bcrypt مع 12 Salt Rounds يضمن أقصى حماية لكلمات المرور.' 
              : 'Passwords secured with 12 bcrypt salt rounds for military-grade protection.'}
          </div>
        </div>
      </div>

      {/* Two-Column Grid: Change Password + Update Admin Email */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Change Master Password */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col justify-between">
          <div>
            <div className="border-b border-border pb-4 mb-5">
              <div className="flex items-center gap-2 mb-1">
                <Lock className="text-emerald-500" size={18} />
                <h2 className="text-base font-bold">{isAr ? 'تغيير كلمة المرور' : 'Change Master Password'}</h2>
              </div>
              <p className="text-xs text-muted-foreground">
                {isAr 
                  ? 'أدخل كلمة المرور الحالية، ثم اختر كلمة مرور قوية جديدة ووثّقها.' 
                  : 'Enter current password, select a strong new passphrase, and authenticate.'}
              </p>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              {/* Current Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  {isAr ? 'كلمة المرور الحالية' : 'Current Password'}
                </label>
                <div className="relative">
                  <Input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className={`absolute top-2.5 text-muted-foreground hover:text-foreground ${isAr ? 'left-3' : 'right-3'}`}
                  >
                    {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  {isAr ? 'كلمة المرور الجديدة' : 'New Password'}
                </label>
                <div className="relative">
                  <Input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className={`absolute top-2.5 text-muted-foreground hover:text-foreground ${isAr ? 'left-3' : 'right-3'}`}
                  >
                    {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="pt-1.5 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">{isAr ? 'القوة:' : 'Strength:'}</span>
                      <span className={`font-semibold ${strength.color}`}>{strength.label}</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-full flex-1 transition-colors duration-300 ${
                            level <= strength.score ? strength.color.split(' ')[0] : 'bg-muted-foreground/20'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  {isAr ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
                </label>
                <div className="relative">
                  <Input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className={`absolute top-2.5 text-muted-foreground hover:text-foreground ${isAr ? 'left-3' : 'right-3'}`}
                  >
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* 2FA Code if Active */}
              {status?.isTwoFactorEnabled && (
                <div className="space-y-1.5 pt-1 p-3 rounded-xl bg-muted/40 border border-border/60">
                  <label className="text-xs font-bold text-foreground flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Smartphone size={13} className="text-emerald-500" />
                      {isAr ? 'رمز Authenticator من هاتفك' : '6-Digit Authenticator Code'}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">30s</span>
                  </label>
                  <Input
                    type="text"
                    maxLength={6}
                    value={passwordTotpCode}
                    onChange={(e) => setPasswordTotpCode(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="123456"
                    required
                    className="font-mono text-center tracking-[0.4em] font-bold"
                    dir="ltr"
                  />
                </div>
              )}

              <Button
                type="submit"
                disabled={submittingPassword || (status?.isTwoFactorEnabled && passwordTotpCode.length !== 6)}
                className="w-full mt-3 font-semibold bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                {submittingPassword ? (
                  <>
                    <Loader2 size={15} className="animate-spin mr-2" />
                    {isAr ? 'جاري التحديث...' : 'Updating...'}
                  </>
                ) : (
                  isAr ? 'حفظ كلمة المرور الجديدة' : 'Update Password'
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Card 2: Update Admin Email */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col justify-between">
          <div>
            <div className="border-b border-border pb-4 mb-5">
              <div className="flex items-center gap-2 mb-1">
                <Mail className="text-emerald-500" size={18} />
                <h2 className="text-base font-bold">{isAr ? 'تغيير البريد الإلكتروني للمدير' : 'Update Admin Email'}</h2>
              </div>
              <p className="text-xs text-muted-foreground">
                {isAr 
                  ? 'هذا البريد هو المستخدم لتسجيل الدخول للوحة التحكم واستلام الإشعارات.' 
                  : 'This email is used to log in to Yusuf CMS and receive administrative notifications.'}
              </p>
            </div>

            <form onSubmit={handleUpdateEmail} className="space-y-4">
              {/* Current Email Display */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  {isAr ? 'البريد الإلكتروني الحالي' : 'Current Active Email'}
                </label>
                <div className="p-2.5 rounded-lg bg-muted/50 border border-border/60 text-xs font-mono font-medium text-foreground">
                  {status?.email}
                </div>
              </div>

              {/* New Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  {isAr ? 'البريد الإلكتروني الجديد' : 'New Email Address'}
                </label>
                <Input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="admin-new@example.com"
                  required
                  className="font-mono"
                  dir="ltr"
                />
              </div>

              {/* Password Authorization */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  {isAr ? 'كلمة المرور الحالية للتأكيد' : 'Current Password (Authorization)'}
                </label>
                <div className="relative">
                  <Input
                    type={showEmailPassword ? 'text' : 'password'}
                    value={emailPassword}
                    onChange={(e) => setEmailPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmailPassword(!showEmailPassword)}
                    className={`absolute top-2.5 text-muted-foreground hover:text-foreground ${isAr ? 'left-3' : 'right-3'}`}
                  >
                    {showEmailPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* 2FA Code if Active */}
              {status?.isTwoFactorEnabled && (
                <div className="space-y-1.5 pt-1 p-3 rounded-xl bg-muted/40 border border-border/60">
                  <label className="text-xs font-bold text-foreground flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Smartphone size={13} className="text-emerald-500" />
                      {isAr ? 'رمز Authenticator من هاتفك' : '6-Digit Authenticator Code'}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">30s</span>
                  </label>
                  <Input
                    type="text"
                    maxLength={6}
                    value={emailTotpCode}
                    onChange={(e) => setEmailTotpCode(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="123456"
                    required
                    className="font-mono text-center tracking-[0.4em] font-bold"
                    dir="ltr"
                  />
                </div>
              )}

              <Button
                type="submit"
                disabled={submittingEmail || !newEmail || !emailPassword || (status?.isTwoFactorEnabled && emailTotpCode.length !== 6)}
                className="w-full mt-3 font-semibold bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                {submittingEmail ? (
                  <>
                    <Loader2 size={15} className="animate-spin mr-2" />
                    {isAr ? 'جاري تحديث البريد...' : 'Updating Email...'}
                  </>
                ) : (
                  isAr ? 'حفظ البريد الإلكتروني الجديد' : 'Update Email Address'
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Setup 2FA Modal */}
      {showSetupModal && setupData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-6">
            <div className="border-b border-border pb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <QrCode size={20} className="text-emerald-500" />
                {isAr ? 'إعداد Google Authenticator بخطوتين' : 'Set Up Google Authenticator'}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {isAr 
                  ? 'امسح الباركود بهاتفك من خلال تطبيق المصادقة، ثم أدخل الرمز الظاهر لتأكيد التفعيل.' 
                  : 'Scan the QR code with your authenticator app and enter the generated 6-digit code.'}
              </p>
            </div>

            {/* Step 1: QR Code Image */}
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="p-3 bg-white rounded-2xl border-2 border-border shadow-md">
                <img 
                  src={setupData.qrCode} 
                  alt="Google Authenticator QR Code" 
                  className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                />
              </div>

              {/* Secret key manual entry */}
              <div className="w-full bg-muted/60 p-3 rounded-xl border border-border text-center space-y-1.5">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
                  {isAr ? 'أو أدخل المفتاح يدوياً في التطبيق:' : 'Or enter this secret key manually in app:'}
                </span>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-mono font-bold text-xs sm:text-sm tracking-wider select-all text-emerald-400">
                    {setupData.formattedSecret}
                  </span>
                  <button
                    type="button"
                    onClick={copySecret}
                    className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    title={isAr ? 'نسخ المفتاح' : 'Copy Key'}
                  >
                    {copiedKey ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2: Verification */}
            <form onSubmit={handleActivate2FA} className="space-y-3">
              <label className="text-xs font-semibold text-foreground block text-center">
                {isAr ? 'أدخل الرمز المكون من 6 أرقام الظاهر على هاتفك الآن:' : 'Enter the 6-digit code generated by the app:'}
              </label>
              <Input
                type="text"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="123456"
                required
                className="font-mono text-center tracking-[0.4em] text-xl font-bold"
                dir="ltr"
                autoFocus
              />

              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSetupModal(false)}
                  className="w-1/2 text-xs"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button
                  type="submit"
                  disabled={activating2FA || verificationCode.length !== 6}
                  className="w-1/2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
                >
                  {activating2FA ? (
                    <>
                      <Loader2 size={14} className="animate-spin mr-1" />
                      {isAr ? 'جاري التأكيد...' : 'Activating...'}
                    </>
                  ) : (
                    isAr ? 'تأكيد وتفعيل 2FA' : 'Verify & Enable 2FA'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Disable 2FA Modal */}
      {showDisableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-destructive/30 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-5">
            <div className="flex items-center gap-2 text-destructive border-b border-border pb-3">
              <ShieldAlert size={22} />
              <h3 className="text-base font-bold">
                {isAr ? 'إلغاء تفعيل Google Authenticator' : 'Disable Google Authenticator'}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              {isAr 
                ? 'لأسباب أمنية، يرجى إدخال كلمة المرور الحالية ورمز المصادقة الحالي لإلغاء تفعيل الحماية.' 
                : 'For security purposes, please confirm with your current password and active 6-digit TOTP code.'}
            </p>

            <form onSubmit={handleDisable2FA} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  {isAr ? 'كلمة المرور الحالية' : 'Current Password'}
                </label>
                <Input
                  type="password"
                  value={disablePassword}
                  onChange={(e) => setDisablePassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  {isAr ? 'رمز المصادقة من هاتفك (6 أرقام)' : 'Current 6-Digit Authenticator Code'}
                </label>
                <Input
                  type="text"
                  maxLength={6}
                  value={disableCode}
                  onChange={(e) => setDisableCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="123456"
                  required
                  className="font-mono text-center tracking-[0.4em] font-bold"
                  dir="ltr"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDisableModal(false)}
                  className="w-1/2 text-xs"
                >
                  {isAr ? 'تراجع' : 'Cancel'}
                </Button>
                <Button
                  type="submit"
                  disabled={disabling2FA || !disablePassword || disableCode.length !== 6}
                  className="w-1/2 bg-destructive hover:bg-destructive/90 text-white font-semibold text-xs"
                >
                  {disabling2FA ? (
                    <>
                      <Loader2 size={14} className="animate-spin mr-1" />
                      {isAr ? 'جاري الإلغاء...' : 'Disabling...'}
                    </>
                  ) : (
                    isAr ? 'تأكيد الإلغاء' : 'Confirm Disable'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Security;
