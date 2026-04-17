import { Fragment, memo, useState, useEffect } from "react";
import { WebsiteLayout } from "presentation/layouts/WebsiteLayout";
import { Seo } from "@presentation/components/ui/Seo";
import { ContentCard } from "@presentation/components/ui/ContentCard";
import { 
    Button, CircularProgress, Typography, Avatar, Divider,
    Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, TextField,
    Grid, Card, CardHeader, CardMedia, CardContent, Box, IconButton
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';
import ClearIcon from '@mui/icons-material/Clear';

import { UserControllerApi, PostControllerApi, CommentControllerApi, UserDto, PostDto, Configuration } from "@infrastructure/apis/client";
import { toast } from "react-toastify";
import { useAppSelector } from "@application/store";
import { useParams } from "react-router-dom";
import { useIntl } from "react-intl";

export const ProfilePage = memo(() => {
    const { token } = useAppSelector(x => x.profileReducer);
    const { id: profileId } = useParams<{ id: string }>();
    const { formatMessage } = useIntl();

    let currentUserEmail: string | null = null;
    let isAdmin = false;

    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            currentUserEmail = payload.sub; 
            const roles = payload.roles || payload.authorities || [];
            isAdmin = roles.includes("ADMIN");
        } catch (e) {
            console.error("Could not decode token", e);
        }
    }

    const [profile, setProfile] = useState<UserDto | null>(null);
    const [posts, setPosts] = useState<PostDto[]>([]);
    const [loading, setLoading] = useState(true);

    const [newComments, setNewComments] = useState<{ [key: string]: string }>({});

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<PostDto | null>(null);
    const [newTitle, setNewTitle] = useState("");
    const [newIngredients, setNewIngredients] = useState("");
    const [newInstructions, setNewInstructions] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletePostId, setDeletePostId] = useState<string | null>(null);

    const fetchData = async () => {
        if (!profileId) return;
        setLoading(true);
        try {
            const config = new Configuration({ accessToken: token || undefined });
            const userApi = new UserControllerApi(config);
            const postApi = new PostControllerApi(config);

            const userResponse = await userApi.getUserProfile({ id: profileId });
            setProfile(userResponse);

            const postsResponse = await postApi.getPostsByUser({ userId: profileId, page: 0, size: 50 });
            setPosts(postsResponse.content || []);

        } catch (error) {
            toast.error(formatMessage({ id: "globals.loadingFailed" }));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [profileId]);

    const handleAddComment = async (postId: string) => {
        const text = newComments[postId];
        if (!text || text.trim() === "") return;

        try {
            const api = new CommentControllerApi(new Configuration({ accessToken: token || undefined }));
            await api.addComment({
                postId: postId,
                commentDto: { content: text.trim() }
            });
            
            setNewComments(prev => ({ ...prev, [postId]: "" }));
            fetchData(); 
            toast.success(formatMessage({ id: "globals.comment_added" }));
        } catch (error) {
            toast.error(formatMessage({ id: "globals.comment_error" }));
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            const api = new CommentControllerApi(new Configuration({ accessToken: token || undefined }));
            await api.deleteComment({ id: commentId });
            toast.success(formatMessage({ id: "globals.comment_deleted" }));
            fetchData();
        } catch (error) {
            toast.error(formatMessage({ id: "globals.comment_error" }));
        }
    };

    const handleOpenEdit = (post: PostDto) => {
        if (!post.id) return;
        setEditingPost(post);
        setNewTitle(post.recipe?.title || "");
        setNewIngredients(post.recipe?.ingredients || "");
        setNewInstructions(post.recipe?.instructions || "");
        setIsFormOpen(true);
    };

    const handleSubmitPost = async () => {
        if (!newTitle || !newIngredients || !newInstructions) {
            toast.warning(formatMessage({ id: "globals.fill_fields" }));
            return;
        }
        setIsSubmitting(true);
        try {
            const api = new PostControllerApi(new Configuration({ accessToken: token || undefined }));
            if (editingPost && editingPost.id) {
                const updatedPostDto: any = {
                    ...editingPost,
                    recipe: { 
                        ...editingPost.recipe,
                        title: newTitle, 
                        ingredients: newIngredients, 
                        instructions: newInstructions 
                    }
                };

                await api.updatePost({
                    id: editingPost.id,
                    postDto: updatedPostDto
                });
                toast.success(formatMessage({ id: "globals.post_updated" }));
                setIsFormOpen(false);
                fetchData();
            }
        } catch (error) {
            toast.error(formatMessage({ id: "globals.save_error" }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!deletePostId) return;
        setIsSubmitting(true);
        try {
            const api = new PostControllerApi(new Configuration({ accessToken: token || undefined }));
            await api.deletePost({ id: deletePostId });
            toast.success(formatMessage({ id: "globals.post_deleted" }));
            setDeletePostId(null);
            fetchData();
        } catch (error) {
            toast.error(formatMessage({ id: "globals.delete_error" }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleFollow = async () => {
        if (!profile || !profile.id) return;
        try {
            const api = new UserControllerApi(new Configuration({ accessToken: token || undefined }));
            if (profile.isFollowed) {
                await api.unfollow({ targetId: profile.id });
                toast.info(formatMessage({ id: "globals.unfollowed" }));
            } else {
                await api.follow({ targetId: profile.id });
                toast.success(formatMessage({ id: "globals.followed" }));
            }
            fetchData();
        } catch (error) {
            toast.error(formatMessage({ id: "globals.save_error" }));
        }
    };

    const isOwnProfile = profile?.email === currentUserEmail;

    return (
        <Fragment>
            <Seo title={`Custom Chef | ${profile ? profile.username : formatMessage({ id: "globals.profile" })}`} />
            <WebsiteLayout>
                <div className="pl-[50px] pr-[50px]">
                    <ContentCard title={formatMessage({ id: "globals.user_profile" })}>
                        {loading ? (
                            <div className="flex justify-center p-8"><CircularProgress /></div>
                        ) : profile ? (
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center justify-between bg-gray-50 p-6 rounded-lg shadow-sm border">
                                    <div className="flex items-center gap-6">
                                        <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}>
                                            <PersonIcon fontSize="large" />
                                        </Avatar>
                                        <div>
                                            <Typography variant="h4">{profile.username}</Typography>
                                            <Typography variant="subtitle1" color="textSecondary">{profile.email}</Typography>
                                        </div>
                                    </div>
                                    {!isOwnProfile && (
                                        <Button 
                                            variant={profile.isFollowed ? "outlined" : "contained"} 
                                            color={profile.isFollowed ? "inherit" : "primary"}
                                            size="large"
                                            onClick={toggleFollow}
                                        >
                                            {profile.isFollowed ? formatMessage({ id: "globals.unfollow" }) : formatMessage({ id: "globals.follow" })}
                                        </Button>
                                    )}
                                </div>

                                <Divider />

                                <Typography variant="h6">
                                    {formatMessage({ id: "globals.recipes_by" }, { username: profile.username })}
                                </Typography>
                                
                                {posts.length === 0 ? (
                                    <Typography align="center" sx={{ py: 5, color: 'text.secondary' }}>
                                        {formatMessage({ id: "globals.no_user_posts" })}
                                    </Typography>
                                ) : (
                                    <Grid container spacing={3}>
                                        {posts.map((post) => (
                                            <Grid item xs={12} sm={6} md={4} key={post.id}>
                                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2, boxShadow: 3 }}>
                                                    <CardHeader
                                                        avatar={<Avatar sx={{ bgcolor: 'secondary.main' }}>{post.authorUsername?.charAt(0).toUpperCase()}</Avatar>}
                                                        title={
                                                            <Box display="flex" alignItems="center" gap={1}>
                                                                <Typography fontWeight="bold">{post.authorUsername}</Typography>
                                                                
                                                                {post.authorIsFollowed && (
                                                                    <Typography 
                                                                        variant="caption" 
                                                                        sx={{ 
                                                                            bgcolor: 'rgba(76, 175, 80, 0.1)', 
                                                                            color: 'success.main', 
                                                                            px: 1, 
                                                                            borderRadius: 1,
                                                                            fontWeight: 'medium',
                                                                            fontSize: '0.65rem',
                                                                            textTransform: 'uppercase'
                                                                        }}
                                                                    >
                                                                        {formatMessage({ id: "globals.followed_by_you" })}
                                                                    </Typography>
                                                                )}
                                                            </Box>
                                                        }
                                                        subheader={new Date(post.createdAt!).toLocaleDateString()}
                                                        action={
                                                            (isAdmin || post.authorEmail === currentUserEmail) && (
                                                                <Box>
                                                                    <IconButton size="small" onClick={() => handleOpenEdit(post)}>
                                                                        <EditIcon fontSize="small" color="primary" />
                                                                    </IconButton>
                                                                    <IconButton size="small" onClick={() => post.id && setDeletePostId(post.id)}>
                                                                        <DeleteIcon fontSize="small" color="error" />
                                                                    </IconButton>
                                                                </Box>
                                                            )
                                                        }
                                                    />
                                                    
                                                    {post.imageUrl && (
                                                        <CardMedia
                                                            component="img"
                                                            height="200"
                                                            sx={{ objectFit: 'cover', maxHeight: 200 }}
                                                            image={post.imageUrl}
                                                            alt={post.recipe?.title}
                                                        />
                                                    )}

                                                    <CardContent sx={{ flexGrow: 1 }}>
                                                        <Typography variant="h6" gutterBottom>{post.recipe?.title}</Typography>
                                                        <Typography variant="body2" color="text.secondary" paragraph>
                                                            <b>{formatMessage({ id: "globals.ingredients" })}:</b> {post.recipe?.ingredients}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                                                            <b>{formatMessage({ id: "globals.instructions" })}:</b> {post.recipe?.instructions}
                                                        </Typography>
                                                    </CardContent>

                                                    <Divider />
                                                    
                                                    <CardContent sx={{ py: 1, bgcolor: '#f9fafb' }}>
                                                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                                                            <ChatBubbleOutlineIcon fontSize="small" color="action" />
                                                            <Typography variant="subtitle2">
                                                                {formatMessage({ id: "globals.comments" })} ({post.comments?.length || 0})
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ maxHeight: 150, overflowY: 'auto', mb: 1, pr: 1 }}>
                                                            {post.comments?.map((comment) => (
                                                                <Box key={comment.id} sx={{ mb: 0.5, bgcolor: 'white', p: 1, borderRadius: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                    <Typography variant="caption" sx={{ flexGrow: 1, pr: 1 }}>
                                                                        <b>{comment.authorUsername}:</b> {comment.content}
                                                                    </Typography>
                                                                    
                                                                    {(isAdmin || comment.authorEmail === currentUserEmail) && (
                                                                        <IconButton 
                                                                            size="small" 
                                                                            onClick={() => comment.id && handleDeleteComment(comment.id)}
                                                                        >
                                                                            <ClearIcon sx={{ fontSize: 16 }} color="error" />
                                                                        </IconButton>
                                                                    )}
                                                                </Box>
                                                            ))}
                                                        </Box>

                                                        <Box display="flex" alignItems="center" gap={1} mt={1}>
                                                            <TextField
                                                                size="small"
                                                                fullWidth
                                                                placeholder={formatMessage({ id: "globals.write_comment" })}
                                                                variant="outlined"
                                                                value={newComments[post.id!] || ""}
                                                                onChange={(e) => setNewComments({ ...newComments, [post.id!]: e.target.value })}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        e.preventDefault();
                                                                        handleAddComment(post.id!);
                                                                    }
                                                                }}
                                                                sx={{ bgcolor: 'white' }}
                                                            />
                                                            <IconButton 
                                                                color="primary" 
                                                                onClick={() => handleAddComment(post.id!)} 
                                                                disabled={!newComments[post.id!]?.trim()}
                                                            >
                                                                <SendIcon />
                                                            </IconButton>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </div>
                        ) : (
                            <Typography color="error">{formatMessage({ id: "globals.profile_not_found" })}</Typography>
                        )}
                    </ContentCard>
                </div>

                <Dialog open={isFormOpen} onClose={() => setIsFormOpen(false)} fullWidth maxWidth="sm">
                    <DialogTitle>{formatMessage({ id: "globals.edit_post" })}</DialogTitle>
                    <DialogContent className="flex flex-col gap-4 mt-2">
                        <TextField label={formatMessage({ id: "globals.title" })} variant="outlined" fullWidth value={newTitle} onChange={(e) => setNewTitle(e.target.value)} sx={{ mt: 1 }} />
                        <TextField label={formatMessage({ id: "globals.ingredients" })} variant="outlined" fullWidth multiline rows={2} value={newIngredients} onChange={(e) => setNewIngredients(e.target.value)} />
                        <TextField label={formatMessage({ id: "globals.instructions" })} variant="outlined" fullWidth multiline rows={4} value={newInstructions} onChange={(e) => setNewInstructions(e.target.value)} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsFormOpen(false)}>{formatMessage({ id: "globals.cancel" })}</Button>
                        <Button onClick={handleSubmitPost} variant="contained" color="success" disabled={isSubmitting}>
                            {formatMessage({ id: "globals.save" })}
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={!!deletePostId} onClose={() => setDeletePostId(null)}>
                    <DialogTitle>{formatMessage({ id: "globals.confirm_delete" })}</DialogTitle>
                    <DialogContent><DialogContentText>{formatMessage({ id: "globals.confirm_delete_text" })}</DialogContentText></DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeletePostId(null)}>{formatMessage({ id: "globals.cancel" })}</Button>
                        <Button onClick={handleConfirmDelete} color="error" variant="contained" disabled={isSubmitting}>
                            {formatMessage({ id: "globals.delete" })}
                        </Button>
                    </DialogActions>
                </Dialog>
            </WebsiteLayout>
        </Fragment>
    );
});