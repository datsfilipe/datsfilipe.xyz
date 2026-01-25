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

  const totalNotes = node.notes.length + Object.values(node.children).reduce(
    (acc, child) => acc + child.notes.length + Object.values(child.children).reduce(
      (a, c) => a + c.notes.length, 0
    ), 0
  );

  return (
    <div className={level > 0 ? 'ml-5' : ''}>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-2 mb-2 py-1 px-2 -ml-2 rounded-md hover:bg-surface-1 transition-colors group"
      >
        <span className="text-subtle group-hover:text-muted transition-colors text-xs">
          {collapsed ? '▶' : '▼'}
        </span>
        <span className="font-semibold">{node.name}</span>
        <span className="text-subtle text-xs">({totalNotes})</span>
      </button>

      {!collapsed && (
        <div className="ml-3 border-l border-subtle pl-4 space-y-1">
          {Object.values(node.children).map((child) => (
            <TreeView key={child.name} node={child} level={level + 1} />
          ))}
          {node.notes.map((note) => (
            <a
              key={note.path}
              href={note.path}
              className="block py-1 px-2 -ml-2 rounded-md text-muted hover:text-fg hover:bg-surface-1 transition-all"
            >
              → {note.title}
            </a>
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

  const tree = buildTree(notes);

  return (
    <section id="notes" className="w-full max-w-6xl mx-auto py-20 px-4">
      <div className="mb-12">
        <h2 className="text-5xl md:text-6xl font-bold mb-3">Notes</h2>
        <p className="font-mono text-sm text-muted">brain dump / study notes</p>
      </div>

      <div className="card-bordered p-8">
        <div className="mb-6 pb-4 border-b border-subtle">
          <span className="font-mono text-xs text-subtle">{notes.length} total notes</span>
        </div>

        {loading ? (
          <div className="text-center py-8 font-mono text-sm text-muted">Loading notes...</div>
        ) : (
          <div className="font-mono text-sm space-y-1">
            {Object.values(tree).map((node) => (
              <TreeView key={node.name} node={node} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
