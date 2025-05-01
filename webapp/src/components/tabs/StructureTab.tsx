// filepath: f:\projects\codelore\webapp\src\components\tabs\StructureTab.tsx
import React, { useState } from 'react';
import { RepositoryData, RepoTreeItem } from '@/types/repository';

interface StructureTabProps {
    data: RepositoryData;
}

type TreeItem = {
    name: string;
    type: string;
    size?: number;
    path: string;
    depth: number;
    children?: TreeItem[];
    id?: string;
};

const buildFolderTree = (repoTree: RepoTreeItem[]) => {
    // Sort items to ensure directories come first, then alphabetically by path
    const sortedItems = [...repoTree].sort((a, b) => {
        if (a.type === 'tree' && b.type !== 'tree') return -1;
        if (a.type !== 'tree' && b.type === 'tree') return 1;
        return a.path.localeCompare(b.path);
    });

    const tree: any = {};
    sortedItems.forEach(item => {
        const parts = item.path.split('/');
        let current = tree;

        // Create nested structure for every part of the path
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const isLastPart = i === parts.length - 1;

            if (!current[part]) {
                if (isLastPart) {
                    current[part] = { ...item, isFile: item.type === 'blob' };
                } else {
                    current[part] = {
                        isFolder: true,
                        children: {},
                        path: parts.slice(0, i + 1).join('/')
                    };
                }
            }

            if (!isLastPart) {
                if (!current[part].children) {
                    current[part].children = {};
                }
                current = current[part].children;
            }
        }
    });

    return formatTreeForRendering(tree);
};

const formatTreeForRendering = (tree: any, depth = 0): TreeItem[] => {
    return Object.entries(tree).map(([key, value]: [string, any]) => {
        if (value.isFile) {
            return {
                name: key,
                type: 'file',
                size: value.size,
                path: value.path,
                depth,
                id: `file-${value.path}`
            };
        } else {
            return {
                name: key,
                type: 'folder',
                children: formatTreeForRendering(value.children || {}, depth + 1),
                path: value.path || key,
                depth,
                id: `folder-${value.path || key}`
            };
        }
    });
};

const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const iconMap: { [key: string]: { color: string, icon: JSX.Element } } = {
        js: {
            color: 'text-yellow-500',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 3h18v18H3V3zm16.5 15.5v-6.75h-3v1.5h1.5v5.25h-1.5v1.5h4.5v-1.5h-1.5zm-9-1.5v-3a1.5 1.5 0 0 1 3 0v3a1.5 1.5 0 0 1-3 0zm1.5-3v3a.5.5 0 0 0 1 0v-3a.5.5 0 0 0-1 0z"></path>
                </svg>
            )
        },
        ts: {
            color: 'text-blue-500',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 3h18v18H3V3zm10.5 10.5v4.5h-1.5v-4.5H9v-1.5h6v1.5h-1.5z"></path>
                    <path d="M13.5 9h-6v1.5H12v1.5h-3v-1.5H7.5v-3h6z"></path>
                </svg>
            )
        },
        py: {
            color: 'text-green-600',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07l.01-.13.05-.19.08-.25.12-.27.15-.27.19-.24.18-.2.2-.15.22-.12.22-.08.22-.05.22-.02.14.01z"></path>
                </svg>
            )
        },
        json: {
            color: 'text-yellow-600',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm3.5 14a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm7-1.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0zm-7-6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm7-1.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0z"></path>
                </svg>
            )
        },
        md: {
            color: 'text-gray-700',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.56 3A2.45 2.45 0 0 1 23 5.46v13.08A2.46 2.46 0 0 1 20.56 21H3.44A2.44 2.44 0 0 1 1 18.54V5.46A2.44 2.44 0 0 1 3.44 3h17.12zM7 15V7l3 3l3-3v8h2V7h-2l-3 3l-3-3H5v8h2z"></path>
                </svg>
            )
        },
        default: {
            color: 'text-gray-500',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
            )
        }
    };
    return extension && iconMap[extension] ? iconMap[extension] : iconMap.default;
};

const TreeView: React.FC<{ items: TreeItem[] }> = ({ items }) => {
    const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

    const toggleFolder = (folderId: string) => {
        setExpandedFolders(prev => ({
            ...prev,
            [folderId]: !prev[folderId]
        }));
    };

    return (
        <ul className="space-y-1">
            {items.map((item) => {
                const indentation = item.depth * 20;
                const isFolder = item.type === 'folder';
                const isFile = item.type === 'file';
                const isExpanded = isFolder ? (expandedFolders[item.id!] !== false) : false;

                return (
                    <li key={item.path} className="py-1">
                        <div
                            style={{ paddingLeft: `${indentation}px` }}
                            className="flex items-center group hover:bg-gray-100 rounded px-2 py-1"
                        >
                            {/* Toggle Button for Folders */}
                            {isFolder && (
                                <button
                                    onClick={() => toggleFolder(item.id!)}
                                    className="mr-1 w-4 h-4 flex items-center justify-center text-gray-500 hover:text-gray-700"
                                >
                                    {isExpanded ? (
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    ) : (
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                        </svg>
                                    )}
                                </button>
                            )}

                            {/* File/Folder Icon */}
                            <span className="mr-2">
                                {isFolder ? (
                                    <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <span className={getFileIcon(item.name).color}>{getFileIcon(item.name).icon}</span>
                                )}
                            </span>

                            {/* File/Folder Name */}
                            <span
                                className={`${isFolder ? 'font-medium' : 'font-mono text-sm'}`}
                                onClick={() => isFolder && toggleFolder(item.id!)}
                                style={isFolder ? { cursor: 'pointer' } : {}}
                            >
                                {item.name}
                            </span>

                            {/* File Size */}
                            {isFile && item.size && (
                                <span className="ml-auto text-xs text-gray-500">
                                    {(item.size / 1024).toFixed(1)} KB
                                </span>
                            )}
                        </div>

                        {/* Render children if folder is expanded */}
                        {isFolder && item.children && isExpanded && (
                            <div className="pl-2">
                                <TreeView items={item.children} />
                            </div>
                        )}
                    </li>
                );
            })}
        </ul>
    );
};

const StructureTab: React.FC<StructureTabProps> = ({ data }) => {
    const tree = buildFolderTree(data.repo_tree);

    return (
        <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-6">Repository Structure</h2>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="overflow-auto max-h-[600px]">
                            <TreeView items={tree} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StructureTab;
