import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      navigate(`/projects#${slug}`, { replace: true });
    } else {
      navigate('/projects', { replace: true });
    }
  }, [slug, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
          Loading Project Showcase...
        </span>
      </div>
    </div>
  );
};

export default ProjectDetail;
