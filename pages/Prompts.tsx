import React, { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { StorageService, Prompt } from '../services/storage';
import { Badge } from '../components/UIComponents';

const PromptsPage: React.FC = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<string>('All');
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await StorageService.getLibrary();
      setPrompts(data);

      const tags = await StorageService.getAllTags();
      setAllTags(tags);

      setLoading(false);
    };
    load();
  }, []);

  const filteredPrompts = useMemo(() => {
    const q = search.toLowerCase().trim();

    return prompts.filter((p) => {
      const title = p.title?.toLowerCase() ?? '';
      const desc = p.description?.toLowerCase() ?? '';
      const tags = Array.isArray(p.tags) ? p.tags : [];

      const matchSearch =
        !q ||
        title.includes(q) ||
        desc.includes(q) ||
        tags.join(' ').toLowerCase().includes(q);

      const matchTag =
        activeTag === 'All' ||
        tags.map((t) => t.toLowerCase()).includes(activeTag.toLowerCase());

      return matchSearch && matchTag;
    });
  }, [prompts, search, activeTag]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold">All Prompts</h1>

      <div className="relative w-full">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="ค้นหา prompt..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge
          active={activeTag === 'All'}
          onClick={() => setActiveTag('All')}
          color={activeTag === 'All' ? 'lavender' : 'gray'}
        >
          All
        </Badge>

        {allTags.map((tag) => (
          <Badge
            key={tag}
            active={activeTag === tag}
            onClick={() => setActiveTag(tag)}
            color={activeTag === tag ? 'lavender' : 'gray'}
          >
            {tag}
          </Badge>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500">กำลังโหลด...</p>
      ) : filteredPrompts.length === 0 ? (
        <p className="text-gray-500">ไม่พบ prompt</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrompts.map((p) => (
            <div
              key={p.id}
              className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm"
            >
              <h2 className="font-semibold line-clamp-2">{p.title}</h2>
              {p.description && (
                <p className="text-xs text-gray-500 line-clamp-3 mt-1">
                  {p.description}
                </p>
              )}

              <div className="flex flex-wrap mt-2 gap-1">
                {p.tags?.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-full bg-purple-50 text-[11px] text-purple-700"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <details className="mt-3 text-xs text-gray-700">
                <summary className="cursor-pointer text-purple-600">
                  ดู prompt
                </summary>
                <pre className="mt-2 bg-gray-50 p-2 rounded-lg text-[11px] whitespace-pre-wrap max-h-40 overflow-auto">
                  {p.fullPrompt}
                </pre>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PromptsPage;

