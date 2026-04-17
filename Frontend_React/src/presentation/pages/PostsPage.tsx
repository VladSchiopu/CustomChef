import { Fragment, memo, useState, useEffect } from "react";
import { WebsiteLayout } from "presentation/layouts/WebsiteLayout";
import { Seo } from "@presentation/components/ui/Seo";
import { ContentCard } from "@presentation/components/ui/ContentCard";
import { 
    TablePagination, Button, CircularProgress,
    Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, 
    Grid, Card, CardHeader, CardMedia, CardContent, 
    Avatar, IconButton, Typography, Divider, Box, TextField
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ClearIcon from '@mui/icons-material/Clear';

import { PostControllerApi, PostDto, CommentControllerApi, Configuration } from "@infrastructure/apis/client";
import { toast } from "react-toastify";
import { useAppSelector } from "@application/store";
import { useOwnUserHasRole } from "@infrastructure/hooks/useOwnUser";
import { useIntl } from "react-intl";

export const PostsPage = memo(() => {
    const { token } = useAppSelector(x => x.profileReducer);
    const { formatMessage } = useIntl();
    const isAdminRole = useOwnUserHasRole("ADMIN");

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

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(6);
    const [search, setSearch] = useState("");
    const [posts, setPosts] = useState<PostDto[]>([]); 
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<PostDto | null>(null);
    const [newTitle, setNewTitle] = useState("");
    const [newIngredients, setNewIngredients] = useState("");
    const [newInstructions, setNewInstructions] = useState("");
    
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
    const [deletePostId, setDeletePostId] = useState<string | null>(null);
    const [newComments, setNewComments] = useState<{ [key: string]: string }>({});

    const MAIN_ORANGE = "#FF7034";

    const orangeButtonStyle = {
        bgcolor: MAIN_ORANGE,
        color: 'white',
        '&:hover': {
            bgcolor: '#e65f2b',
        },
        fontWeight: 'bold',
        textTransform: 'none'
    };

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const api = new PostControllerApi(new Configuration({ accessToken: token || undefined }));
            const response = await api.getAllPosts({ page, size: pageSize, search: search || undefined });
            setPosts(response.content || []); 
            setTotalElements(response.totalElements || 0);
        } catch (error) {
            toast.error(formatMessage({ id: "globals.loadingFailed" }));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => { fetchPosts(); }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [page, pageSize, search]);

    const handleAddComment = async (postId: string) => {
        const text = newComments[postId];
        if (!text || text.trim() === "") return;

        try {
            const api = new CommentControllerApi(new Configuration({ accessToken: token || undefined }));
            await api.addComment({ postId, commentDto: { content: text.trim() } });
            setNewComments(prev => ({ ...prev, [postId]: "" }));
            fetchPosts(); 
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
            fetchPosts();
        } catch (error) {
            toast.error(formatMessage({ id: "globals.delete_error" }));
        }
    };

    const handleOpenCreate = () => {
        setEditingPost(null);
        setNewTitle("");
        setNewIngredients("");
        setNewInstructions("");
        setSelectedImageFile(null);
        setPreviewImageUrl(null);
        setIsFormOpen(true);
    };

    const handleOpenEdit = (post: PostDto) => {
        if (!post.id) return;
        setEditingPost(post);
        setNewTitle(post.recipe?.title || "");
        setNewIngredients(post.recipe?.ingredients || "");
        setNewInstructions(post.recipe?.instructions || "");
        setSelectedImageFile(null);
        setPreviewImageUrl(post.imageUrl || null);
        setIsFormOpen(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setSelectedImageFile(file);
            setPreviewImageUrl(URL.createObjectURL(file));
        }
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
                    recipe: { 
                        title: newTitle, 
                        ingredients: newIngredients, 
                        instructions: newInstructions 
                    },
                    imageUrl: editingPost.imageUrl 
                };
                
                await api.updatePost({ id: editingPost.id, postDto: updatedPostDto });
                toast.success(formatMessage({ id: "globals.post_updated" }));
            } else {
                await api.createPost({
                    recipe: { title: newTitle, ingredients: newIngredients, instructions: newInstructions },
                    image: selectedImageFile || undefined
                });
                toast.success(formatMessage({ id: "globals.post_created" }));
            }
            setIsFormOpen(false);
            fetchPosts(); 
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
            fetchPosts(); 
        } catch (error) {
            toast.error(formatMessage({ id: "globals.delete_error_permission" }));
            setDeletePostId(null);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Fragment>
            <Seo title={`Custom Chef | ${formatMessage({ id: "globals.posts" })}`} />
            <WebsiteLayout>
                <div className="pl-[50px] pr-[50px]">
                    <ContentCard title={formatMessage({ id: "globals.community_posts" })}>
                        <div className="flex justify-between items-center mb-4 gap-4">
                            <TextField 
                                label={formatMessage({ id: "globals.search_recipe" })} 
                                variant="outlined" size="small" fullWidth
                                sx={{ maxWidth: '400px' }} value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                            />
                            <Button 
                                variant="contained" 
                                sx={orangeButtonStyle} 
                                onClick={handleOpenCreate}
                            >
                                {formatMessage({ id: "globals.create_post" })}
                            </Button>
                        </div>

                        {loading ? (
                            <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>
                        ) : posts.length === 0 ? (
                            <Typography align="center" sx={{ py: 5, color: 'text.secondary' }}>
                                {formatMessage({ id: "globals.no_posts" })}
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
                                                <Typography variant="body2" color="text.secondary">
                                                    <b>{formatMessage({ id: "globals.ingredients" })}:</b> {post.recipe?.ingredients}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
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
                                                <Box sx={{ maxHeight: 150, overflowY: 'auto', mb: 1 }}>
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
                                                        size="small" fullWidth 
                                                        placeholder={formatMessage({ id: "globals.write_comment" })}
                                                        value={newComments[post.id!] || ""}
                                                        onChange={(e) => setNewComments({ ...newComments, [post.id!]: e.target.value })}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                handleAddComment(post.id!);
                                                            }
                                                        }}
                                                    />
                                                    <IconButton color="primary" onClick={() => handleAddComment(post.id!)} disabled={!newComments[post.id!]?.trim()}>
                                                        <SendIcon />
                                                    </IconButton>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                        <TablePagination
                            component="div" count={totalElements} page={page} onPageChange={(e, p) => setPage(p)}
                            rowsPerPage={pageSize} rowsPerPageOptions={[3, 6, 12, 24]}
                            onRowsPerPageChange={(e) => { setPageSize(parseInt(e.target.value, 10)); setPage(0); }}
                        />

                        <Dialog open={isFormOpen} onClose={() => setIsFormOpen(false)} fullWidth maxWidth="sm">
                            <DialogTitle>
                                {editingPost ? formatMessage({ id: "globals.edit_post" }) : formatMessage({ id: "globals.create_new_post" })}
                            </DialogTitle>
                            <DialogContent className="flex flex-col gap-4 mt-2">
                                {(previewImageUrl || (editingPost && editingPost.imageUrl)) && (
                                    <Box display="flex" flexDirection="column" alignItems="center" gap={2} mb={2}>
                                        <img 
                                            src={previewImageUrl || editingPost?.imageUrl} 
                                            alt="Preview" 
                                            style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }} 
                                        />
                                        
                                        {!editingPost && (
                                            <Button 
                                                variant="contained" 
                                                component="label" 
                                                startIcon={<PhotoCameraIcon />}
                                                sx={orangeButtonStyle}
                                            >
                                                {formatMessage({ id: "globals.choose_photo" })} 
                                                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                                            </Button>
                                        )}
                                    </Box>
                                )}
                                
                                {!editingPost && !previewImageUrl && (
                                    <Button 
                                        variant="contained" 
                                        component="label" 
                                        startIcon={<PhotoCameraIcon />}
                                        sx={orangeButtonStyle}
                                    >
                                        {formatMessage({ id: "globals.choose_photo" })} 
                                        <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                                    </Button>
                                )}

                                <TextField label={formatMessage({ id: "globals.title" })} fullWidth value={newTitle} onChange={(e) => setNewTitle(e.target.value)} sx={{ mt: 1 }} />
                                <TextField label={formatMessage({ id: "globals.ingredients" })} fullWidth multiline rows={2} value={newIngredients} onChange={(e) => setNewIngredients(e.target.value)} />
                                <TextField label={formatMessage({ id: "globals.instructions" })} fullWidth multiline rows={4} value={newInstructions} onChange={(e) => setNewInstructions(e.target.value)} />
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
                    </ContentCard>
                </div>
            </WebsiteLayout>
        </Fragment>
    );
});