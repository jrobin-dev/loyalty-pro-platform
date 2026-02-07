"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { getLessonComments, postComment } from "@/app/actions/academy"
import { toast } from "sonner"
import { MessageSquare, Reply, User as UserIcon } from "lucide-react"

interface CommentSectionProps {
    lessonId: string
}

export function CommentSection({ lessonId }: CommentSectionProps) {
    const [comments, setComments] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [newComment, setNewComment] = useState("")
    const [isPosting, setIsPosting] = useState(false)
    const [replyingTo, setReplyingTo] = useState<string | null>(null)
    const [replyContent, setReplyContent] = useState("")

    useEffect(() => {
        if (lessonId) {
            fetchComments()
        }
    }, [lessonId])

    const fetchComments = async () => {
        setIsLoading(true)
        try {
            const result = await getLessonComments(lessonId)
            if (result.success && result.data) {
                setComments(result.data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent, parentId?: string) => {
        e.preventDefault()
        const content = parentId ? replyContent : newComment
        if (!content.trim()) return

        setIsPosting(true)
        try {
            const result = await postComment(lessonId, content, parentId)
            if (result.success) {
                toast.success("Comentario publicado")
                setNewComment("")
                setReplyContent("")
                setReplyingTo(null)
                fetchComments()
            } else {
                toast.error(result.error || "Error al publicar")
            }
        } catch (error) {
            toast.error("Error inesperado")
        } finally {
            setIsPosting(false)
        }
    }

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare size={20} /> Comentarios
            </h3>

            {/* New Comment Input */}
            <form onSubmit={(e) => handleSubmit(e)} className="space-y-2">
                <Textarea
                    placeholder="Deja tu comentario o pregunta..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[100px]"
                />
                <div className="flex justify-end">
                    <Button type="submit" disabled={isPosting || !newComment.trim()}>
                        {isPosting ? "Publicando..." : "Publicar Comentario"}
                    </Button>
                </div>
            </form>

            {/* Comment List */}
            <div className="space-y-6 mt-8">
                {isLoading ? (
                    <div className="text-center py-4 text-muted-foreground">Cargando comentarios...</div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-8 bg-muted/30 rounded-lg">
                        <p className="text-muted-foreground">Sé el primero en comentar.</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            replyingTo={replyingTo}
                            setReplyingTo={setReplyingTo}
                            replyContent={replyContent}
                            setReplyContent={setReplyContent}
                            onReply={handleSubmit}
                            isPosting={isPosting}
                        />
                    ))
                )}
            </div>
        </div>
    )
}

function CommentItem({ comment, replyingTo, setReplyingTo, replyContent, setReplyContent, onReply, isPosting }: any) {
    const isReplying = replyingTo === comment.id

    return (
        <div className="flex gap-4">
            <Avatar className="h-10 w-10">
                <AvatarImage src={comment.userAvatar} />
                <AvatarFallback>
                    <UserIcon size={16} />
                </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
                <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{comment.userName}</span>
                        <span className="text-xs text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                </div>

                <div className="flex items-center gap-4 px-2">
                    <button
                        onClick={() => setReplyingTo(isReplying ? null : comment.id)}
                        className="text-xs flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                    >
                        <Reply size={12} /> Responder
                    </button>
                </div>

                {isReplying && (
                    <form onSubmit={(e) => onReply(e, comment.id)} className="ml-4 mt-2 space-y-2">
                        <Textarea
                            placeholder="Escribe tu respuesta..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="min-h-[80px]"
                            autoFocus
                        />
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>Cancelar</Button>
                            <Button type="submit" size="sm" disabled={isPosting || !replyContent.trim()}>
                                Responder
                            </Button>
                        </div>
                    </form>
                )}

                {/* Recursive Replies */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="pl-6 space-y-4 border-l-2 border-border mt-4">
                        {comment.replies.map((reply: any) => (
                            <div key={reply.id} className="flex gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={reply.userAvatar} />
                                    <AvatarFallback><UserIcon size={14} /></AvatarFallback>
                                </Avatar>
                                <div className="flex-1 bg-muted/30 p-3 rounded-lg">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-sm">{reply.userName}</span>
                                        <span className="text-[10px] text-muted-foreground">
                                            {new Date(reply.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-foreground/90">{reply.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
