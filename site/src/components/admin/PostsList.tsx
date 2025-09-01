"use client";

import { useState } from "react";
import { PostsListFilters } from "./PostsListFilters";
import { PostCard } from "./PostCard";
import { EmptyState } from "./EmptyState";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  category: "NEWS" | "VACANCY" | "ANNOUNCEMENT" | "EVENT";
  imageUrl?: string;
  published: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface PostsListProps {
  posts: Post[];
  onDelete: (id: string) => Promise<void>;
  onTogglePublished: (id: string, published: boolean) => Promise<void>;
  isLoading?: boolean;
}

export var PostsList = ({
  posts,
  onDelete,
  onTogglePublished,
  isLoading = false,
}: PostsListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    "ALL" | "NEWS" | "VACANCY" | "ANNOUNCEMENT" | "EVENT"
  >("ALL");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "PUBLISHED" | "DRAFT"
  >("ALL");

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "ALL" || post.category === categoryFilter;

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "PUBLISHED" && post.published) ||
      (statusFilter === "DRAFT" && !post.published);

    return matchesSearch && matchesCategory && matchesStatus;
  });


  const hasFilters = Boolean(searchTerm || categoryFilter !== "ALL" || statusFilter !== "ALL");

  return (
    <div className="space-y-6">
      <PostsListFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {filteredPosts.length === 0 ? (
        <EmptyState hasFilters={hasFilters} />
      ) : (
        <div className="grid gap-4">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={onDelete}
              onTogglePublished={onTogglePublished}
            />
          ))}
        </div>
      )}
    </div>
  );
};
