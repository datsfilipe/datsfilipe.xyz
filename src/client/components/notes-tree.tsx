import { useState, useEffect } from 'react';

interface Note {
  title: string;
  path: string;
  category: string;
}

interface TreeNode {
  name: string;
  children: Record<string, TreeNode>;
  notes: Note[];
}

function buildTree(notes: Note[]): Record<string, TreeNode> {
  const tree: Record<string, TreeNode> = {};

  for (const note of notes) {
    const parts = note.category.split('/').filter(Boolean);
    let current = tree;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = {
          name: part,
          children: {},
          notes: [],
        };
      }

      if (i === parts.length - 1) {
        current[part].notes.push(note);
      }

      current = current[part].children;
    }
  }

  return tree;
}

interface TreeViewProps {
  node: TreeNode;
  level?: number;
}

function TreeView({ node, level = 0 }: TreeViewProps) {
  const [collapsed, setCollapsed] = useState(true);
  const hasChildren = Object.keys(node.children).length > 0;
  const hasNotes = node.notes.length > 0;

  if (!hasChildren && !hasNotes) return null;

  return (
    <div className={level > 0 ? 'ml-6' : ''}>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hover:underline flex items-center gap-2 mb-2"
      >
        <span className="opacity-60">{collapsed ? '▶' : '▼'}</span>
        <span className="font-bold">{node.name}</span>
        {(hasNotes || hasChildren) && (
          <span className="opacity-40 text-xs font-normal">
            ({node.notes.length + Object.values(node.children).reduce((acc, child) => acc + child.notes.length, 0)})
          </span>
        )}
      </button>

      {!collapsed && (
        <div className="ml-6 border-l border-fg pl-4 space-y-2">
          {Object.values(node.children).map((child) => (
            <TreeView key={child.name} node={child} level={level + 1} />
          ))}
          {node.notes.map((note) => (
            <div key={note.path}>
              <a href={note.path} className="hover:underline opacity-80 hover:opacity-100">
                → {note.title}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function NotesTree() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/notes')
      .then(res => res.json())
      .then(data => {
        setNotes(data.notes || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('fetch notes:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading notes...</div>;
  }

  const tree = buildTree(notes);

  return (
    <section id="notes" className="w-full max-w-4xl mx-auto py-20 px-4">
      <div className="mb-12">
        <h2 className="text-5xl md:text-7xl font-bold mb-4">Notes</h2>
        <p className="font-mono text-sm opacity-60">brain dump / study notes</p>
      </div>

      <div className="border border-fg">
        <div className="border-b border-fg px-6 py-3">
          <span className="font-mono text-xs opacity-60">{notes.length} total notes</span>
        </div>

        <div className="p-8 font-mono text-sm">
          {Object.values(tree).map((node) => (
            <TreeView key={node.name} node={node} />
          ))}
        </div>
      </div>
    </section>
  );
}
