import React, { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";

export default function App() {
  const [profile, setProfile] = useState({
    name: "Your Name",
    title: "Software Engineer",
    location: "City, Country",
    phone: "+91 99999 99999",
    email: "you@example.com",
    website: "",
    summary: "Concise 2-3 line professional summary that highlights strengths and focus.",
    experience: [
      {
        role: "Frontend Developer",
        company: "Acme Corp",
        duration: "2021 - Present",
        details: [
          "Built responsive UI with React and optimized performance.",
          "Collaborated with designers and backend teams to ship features.",
        ],
      },
    ],
    education: [
      { degree: "B.Tech Computer Science", school: "ABC University", year: "2020" },
    ],
    skills: ["React", "JavaScript", "HTML/CSS", "Tailwind CSS", "Git"],
  });

  const previewRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => previewRef.current,
    documentTitle: (profile.name || "resume").replace(/\s+/g, "_"),
    pageStyle: `
      @page { size: A4; margin: 20mm; }
      body { -webkit-print-color-adjust: exact; font-family: Inter, Arial, sans-serif; }
    `,
  });

  function updateField(path, value) {
    setProfile((p) => {
      const copy = JSON.parse(JSON.stringify(p));
      const parts = path.split(".");
      let cur = copy;
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
      cur[parts[parts.length - 1]] = value;
      return copy;
    });
  }

  function addExperience() {
    setProfile((p) => ({ ...p, experience: [...p.experience, { role: "", company: "", duration: "", details: [""] }] }));
  }
  function addExpBullet(i) {
    setProfile((p) => { const c = JSON.parse(JSON.stringify(p)); c.experience[i].details.push(""); return c; });
  }
  function removeExp(i) { setProfile(p => ({ ...p, experience: p.experience.filter((_,idx)=>idx!==i) })); }
  function addSkill() { setProfile(p => ({ ...p, skills: [...p.skills, ""] })); }
  function removeSkill(i){ setProfile(p=>({...p, skills: p.skills.filter((_,idx)=>idx!==i)})); }
  function addEducation(){ setProfile(p=>({...p, education:[...p.education, {degree:"", school:"", year:""}]})); }
  function removeEducation(i){ setProfile(p=>({...p, education: p.education.filter((_,idx)=>idx!==i)})); }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form (left two columns on large screens) */}
        <div className="lg:col-span-2 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Edit Resume</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input value={profile.name} onChange={(e)=>updateField("name", e.target.value)} className="mt-1 block w-full rounded border-gray-300 p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input value={profile.title} onChange={(e)=>updateField("title", e.target.value)} className="mt-1 block w-full rounded border-gray-300 p-2" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input placeholder="Location" value={profile.location} onChange={(e)=>updateField("location", e.target.value)} className="mt-1 block w-full rounded border-gray-300 p-2" />
              <input placeholder="Phone" value={profile.phone} onChange={(e)=>updateField("phone", e.target.value)} className="mt-1 block w-full rounded border-gray-300 p-2" />
              <input placeholder="Email" value={profile.email} onChange={(e)=>updateField("email", e.target.value)} className="mt-1 block w-full rounded border-gray-300 p-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Summary</label>
              <textarea rows={3} value={profile.summary} onChange={(e)=>updateField("summary", e.target.value)} className="mt-1 block w-full rounded border-gray-300 p-2" />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Experience</h3>
                <button onClick={addExperience} className="px-2 py-1 bg-indigo-600 text-white rounded text-sm">+ Add</button>
              </div>
              <div className="space-y-3 mt-2">
                {profile.experience.map((job,i)=>(
                  <div key={i} className="p-3 border rounded">
                    <div className="flex justify-between items-center">
                      <strong>{job.role || `Role ${i+1}`}</strong>
                      <div className="space-x-2">
                        <button onClick={()=>removeExp(i)} className="text-red-600 text-sm">Remove</button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                      <input placeholder="Role" value={job.role} onChange={(e)=>updateField(`experience.${i}.role`, e.target.value)} className="p-2 border rounded" />
                      <input placeholder="Company" value={job.company} onChange={(e)=>updateField(`experience.${i}.company`, e.target.value)} className="p-2 border rounded" />
                      <input placeholder="Duration" value={job.duration} onChange={(e)=>updateField(`experience.${i}.duration`, e.target.value)} className="p-2 border rounded" />
                    </div>
                    <div className="mt-2 space-y-2">
                      {job.details.map((d,j)=>(
                        <div key={j} className="flex gap-2 items-center">
                          <span>•</span>
                          <input value={d} onChange={(e)=>updateField(`experience.${i}.details.${j}`, e.target.value)} className="flex-1 p-2 border rounded" />
                        </div>
                      ))}
                      <button onClick={()=>addExpBullet(i)} className="text-sm px-2 py-1 bg-gray-100 rounded">+ Add bullet</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Education</h3>
                <button onClick={addEducation} className="px-2 py-1 bg-indigo-600 text-white rounded text-sm">+ Add</button>
              </div>
              <div className="space-y-3 mt-2">
                {profile.education.map((ed,i)=>(
                  <div key={i} className="p-3 border rounded">
                    <div className="flex justify-between items-center">
                      <strong>{ed.degree || `Degree ${i+1}`}</strong>
                      <button onClick={()=>removeEducation(i)} className="text-red-600 text-sm">Remove</button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                      <input placeholder="Degree" value={ed.degree} onChange={(e)=>updateField(`education.${i}.degree`, e.target.value)} className="p-2 border rounded" />
                      <input placeholder="School" value={ed.school} onChange={(e)=>updateField(`education.${i}.school`, e.target.value)} className="p-2 border rounded" />
                      <input placeholder="Year" value={ed.year} onChange={(e)=>updateField(`education.${i}.year`, e.target.value)} className="p-2 border rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Skills</h3>
                <button onClick={addSkill} className="px-2 py-1 bg-indigo-600 text-white rounded text-sm">+ Add</button>
              </div>
              <div className="space-y-2 mt-2">
                {profile.skills.map((s,i)=>(
                  <div key={i} className="flex gap-2">
                    <input value={s} onChange={(e)=>updateField(`skills.${i}`, e.target.value)} className="flex-1 p-2 border rounded" />
                    <button onClick={()=>removeSkill(i)} className="text-red-600">Remove</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button onClick={handlePrint} className="px-4 py-2 bg-green-600 text-white rounded">Export PDF</button>
              <button onClick={()=>alert('Use Print -> Save as PDF if Export fails')} className="px-4 py-2 bg-gray-200 rounded">Quick Tip</button>
            </div>
          </div>
        </div>

        {/* Preview column */}
        <div className="lg:col-span-1 flex justify-center">
          <div id="resume-container" ref={previewRef}>
            <div className="resume-header">
              <div className="resume-name">{profile.name}</div>
              <div className="resume-contact">{profile.title} • {profile.location} • {profile.phone} • {profile.email}</div>
            </div>

            <div className="resume-section">
              <div className="left-col section-title">SUMMARY</div>
              <div className="right-col text-sm">{profile.summary}</div>
            </div>

            <div className="resume-section">
              <div className="left-col section-title">EXPERIENCE</div>
              <div className="right-col">
                {profile.experience.map((job,i)=>(
                  <div key={i} className="mb-2">
                    <div className="job-title">{job.role}</div>
                    <div className="job-meta">{job.company} • {job.duration}</div>
                    <ul className="list-disc list-inside text-sm">
                      {job.details.map((d,idx)=>(<li key={idx}>{d}</li>))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="resume-section">
              <div className="left-col section-title">SKILLS</div>
              <div className="right-col">
                <div className="flex flex-wrap gap-2">
                  {profile.skills.filter(Boolean).map((s,idx)=>(
                    <span key={idx} className="text-sm bg-gray-100 px-2 py-1 rounded">{s}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="resume-section">
              <div className="left-col section-title">EDUCATION</div>
              <div className="right-col">
                {profile.education.map((ed,i)=>(
                  <div key={i} className="mb-1">
                    <div className="job-title">{ed.degree}</div>
                    <div className="job-meta">{ed.school} • {ed.year}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-6 text-xs text-gray-500">
        Tip: Export PDF uses the browser print dialog for best results.
      </div>
    </div>
  );
}
