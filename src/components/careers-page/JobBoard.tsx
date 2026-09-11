"use client";

import React, { useState, useMemo } from 'react';
import { Filter } from 'lucide-react';
import type { Job } from '../../db/schema';

export default function JobBoard({ jobs, activeTheme }: { jobs: Job[], activeTheme: any }) {
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const JOBS_PER_PAGE = 5;

  // Extract unique locations and types for dropdowns
  const locations = useMemo(() => {
    const locs = new Set<string>();
    jobs.forEach(j => {
      j.locations?.forEach(l => locs.add(l));
    });
    return Array.from(locs).sort();
  }, [jobs]);

  const jobTypes = useMemo(() => {
    const types = new Set<string>();
    jobs.forEach(j => {
      if (j.jobType) types.add(j.jobType);
    });
    return Array.from(types).sort();
  }, [jobs]);

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchSearch = job.title.toLowerCase().includes(search.toLowerCase());
      const matchLocation = locationFilter ? job.locations?.includes(locationFilter) : true;
      const matchType = typeFilter ? job.jobType === typeFilter : true;
      return matchSearch && matchLocation && matchType;
    });
  }, [jobs, search, locationFilter, typeFilter]);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, locationFilter, typeFilter]);

  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const currentJobs = filteredJobs.slice((currentPage - 1) * JOBS_PER_PAGE, currentPage * JOBS_PER_PAGE);

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex flex-row items-center gap-2 bg-white p-2 rounded-full shadow-md ring-1 ring-slate-900/5">
          <input 
            type="text" 
            placeholder="Search roles..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 w-0 px-4 md:px-6 py-2 md:py-3 bg-transparent focus:outline-none text-slate-800 placeholder-slate-400 font-medium"
          />
          
          <button 
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className={`md:hidden p-2 rounded-xl transition-colors shrink-0 ${showMobileFilters ? activeTheme.accentBg + ' text-white' : 'bg-white text-slate-600 shadow-sm border border-slate-200'}`}
          >
            <Filter size={20} />
          </button>

          <div className="w-px h-8 bg-slate-200 hidden md:block"></div>
          
          <select 
            value={locationFilter} 
            onChange={(e) => setLocationFilter(e.target.value)}
            className="hidden md:block md:w-48 px-4 py-3 bg-transparent focus:outline-none text-slate-600 appearance-none cursor-pointer"
          >
            <option value="">All Locations</option>
            {locations.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          
          <div className="w-px h-8 bg-slate-200 hidden md:block"></div>
          
          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
            className="hidden md:block md:w-48 px-4 py-3 bg-transparent focus:outline-none text-slate-600 appearance-none cursor-pointer"
          >
            <option value="">All Types</option>
            {jobTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Mobile Expanded Filters */}
        {showMobileFilters && (
          <div className="md:hidden flex flex-col gap-3 p-5 bg-white rounded-2xl shadow-md ring-1 ring-slate-900/5 animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</label>
              <select 
                value={locationFilter} 
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:outline-none text-slate-700 shadow-sm border border-slate-200 appearance-none"
              >
                <option value="">All Locations</option>
                {locations.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Job Type</label>
              <select 
                value={typeFilter} 
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:outline-none text-slate-700 shadow-sm border border-slate-200 appearance-none"
              >
                <option value="">All Types</option>
                {jobTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {filteredJobs.length === 0 ? (
        <div className={`text-center py-20 ${activeTheme.cardBg} rounded-3xl border ${activeTheme.cardBorder}`}>
          <p className={`${activeTheme.textMuted} text-lg mb-4`}>No positions found matching your criteria.</p>
          <button 
            onClick={() => { setSearch(''); setLocationFilter(''); setTypeFilter(''); }}
            className={`text-sm font-semibold hover:underline ${activeTheme.accentText}`}
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {currentJobs.map(job => (
            <div key={job.id} className={`group ${activeTheme.cardBg} border ${activeTheme.cardBorder} hover:shadow-md transition-all rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6`}>
              <div>
                <h3 className={`text-2xl font-bold ${activeTheme.textColor} mb-2`}>{job.title}</h3>
                <div className={`flex flex-wrap gap-3 text-sm ${activeTheme.textMuted} font-medium`}>
                  {job.department && (
                    <span className="bg-slate-100 px-3 py-1 rounded-full">{job.department}</span>
                  )}
                  {job.locations && job.locations.length > 0 && (
                    <span className="flex items-center gap-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      {job.locations.join(', ')}
                    </span>
                  )}
                  {job.jobType && (
                    <span className="flex items-center gap-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                      {job.jobType}
                    </span>
                  )}
                </div>
              </div>
              <a 
                href={job.applicationUrl} 
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center px-8 py-4 rounded-full text-white font-semibold transition-transform hover:scale-105 shadow-lg ${activeTheme.accentBg}`}
              >
                Apply Now
              </a>
            </div>
          ))}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-full font-medium ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'} ${activeTheme.cardBg} ${activeTheme.textColor} border ${activeTheme.cardBorder}`}
              >
                Previous
              </button>
              <span className={`font-medium ${activeTheme.textMuted}`}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-full font-medium ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'} ${activeTheme.cardBg} ${activeTheme.textColor} border ${activeTheme.cardBorder}`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
