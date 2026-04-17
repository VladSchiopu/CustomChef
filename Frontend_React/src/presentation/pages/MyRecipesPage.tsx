import { Fragment, memo, useState, useEffect } from "react";
import { WebsiteLayout } from "presentation/layouts/WebsiteLayout";
import { Seo } from "@presentation/components/ui/Seo";
import { ContentCard } from "@presentation/components/ui/ContentCard";
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, TextField, TablePagination, Button, CircularProgress,
    Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText,
    Box, Typography
} from "@mui/material";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

import { RecipeControllerApi, PostControllerApi, RecipeDto, Configuration } from "@infrastructure/apis/client";
import { toast } from "react-toastify";
import { useAppSelector } from "@application/store";
import { useIntl } from "react-intl";

export const MyRecipesPage = memo(() => {
    const { token } = useAppSelector(x => x.profileReducer);
    const { formatMessage } = useIntl();

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(6);
    const [search, setSearch] = useState("");
    const [recipes, setRecipes] = useState<RecipeDto[]>([]); 
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);
    const [newTitle, setNewTitle] = useState("");
    const [newIngredients, setNewIngredients] = useState("");
    const [newInstructions, setNewInstructions] = useState("");

    const [deleteRecipeId, setDeleteRecipeId] = useState<string | null>(null);

    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [recipeToPublish, setRecipeToPublish] = useState<RecipeDto | null>(null);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

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

    const fetchRecipes = async () => {
        setLoading(true);
        try {
            const api = new RecipeControllerApi(new Configuration({ accessToken: token || undefined }));
            const response = await api.getMyRecipes({ page, size: pageSize, searchTitle: search || undefined });
            setRecipes(response.content || []); 
            setTotalElements(response.totalElements || 0);
        } catch (error) {
            toast.error(formatMessage({ id: "globals.loadingFailed" }));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => { fetchRecipes(); }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [page, pageSize, search]);

    const handleOpenCreate = () => {
        setEditingRecipeId(null);
        setNewTitle("");
        setNewIngredients("");
        setNewInstructions("");
        setIsFormOpen(true);
    };

    const handleOpenEdit = (recipe: RecipeDto) => {
        if (!recipe.id) return;
        setEditingRecipeId(recipe.id);
        setNewTitle(recipe.title || "");
        setNewIngredients(recipe.ingredients || "");
        setNewInstructions(recipe.instructions || "");
        setIsFormOpen(true);
    };

    const handleSubmitRecipe = async () => {
        if (!newTitle || !newIngredients || !newInstructions) {
            toast.warning(formatMessage({ id: "globals.fill_fields" }));
            return;
        }

        setIsSubmitting(true);
        try {
            const api = new RecipeControllerApi(new Configuration({ accessToken: token || undefined }));
            if (editingRecipeId) {
                await api.updateRecipe({
                    id: editingRecipeId,
                    recipeDto: { title: newTitle, ingredients: newIngredients, instructions: newInstructions }
                });
                toast.success(formatMessage({ id: "globals.recipe_updated_success" }));
            } else {
                await api.createRecipe({
                    recipeDto: { title: newTitle, ingredients: newIngredients, instructions: newInstructions }
                });
                toast.success(formatMessage({ id: "globals.recipe_created_success" }));
            }
            setIsFormOpen(false);
            fetchRecipes(); 
        } catch (error) {
            toast.error(formatMessage({ id: "globals.save_error" }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!deleteRecipeId) return;
        setIsSubmitting(true);
        try {
            const api = new RecipeControllerApi(new Configuration({ accessToken: token || undefined }));
            await api.deleteRecipe({ id: deleteRecipeId });
            toast.success(formatMessage({ id: "globals.recipe_deleted_success" }));
            setDeleteRecipeId(null); 
            fetchRecipes(); 
        } catch (error) {
            toast.error(formatMessage({ id: "globals.delete_error" }));
            setDeleteRecipeId(null);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenPublishModal = (recipe: RecipeDto) => {
        setRecipeToPublish(recipe);
        setSelectedImageFile(null);
        setPreviewImageUrl(null);
        setIsPublishModalOpen(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setSelectedImageFile(file);
            setPreviewImageUrl(URL.createObjectURL(file));
        }
    };

    const handleConfirmPublish = async () => {
        if (!recipeToPublish || !recipeToPublish.id) return;
        
        setIsSubmitting(true);
        try {
            const postApi = new PostControllerApi(new Configuration({ accessToken: token || undefined }));
            await postApi.publishExistingRecipe({ 
                recipeId: recipeToPublish.id,
                image: selectedImageFile || undefined
            });

            toast.success(formatMessage({ id: "globals.publish_success" }, { title: recipeToPublish.title }));
            setIsPublishModalOpen(false);
            fetchRecipes();
        } catch (error) {
            toast.error(formatMessage({ id: "globals.publish_error" }));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Fragment>
            <Seo title={`Custom Chef | ${formatMessage({ id: "globals.recipes" })}`} />
            <WebsiteLayout>
                <div className="pl-[50px] pr-[50px]">
                    <ContentCard title={formatMessage({ id: "globals.my_recipes_notebook" })}>
                        
                        <div className="flex justify-between items-center mb-4">
                            <TextField 
                                label={formatMessage({ id: "globals.search_recipe" })} 
                                variant="outlined" 
                                size="small"
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                            />
                            <Button 
                                variant="contained" 
                                sx={orangeButtonStyle} 
                                onClick={handleOpenCreate}
                            >
                                {formatMessage({ id: "globals.add_new_recipe" })}
                            </Button>
                        </div>

                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{fontWeight: 'bold'}}>{formatMessage({ id: "globals.recipe_title" })}</TableCell>
                                        <TableCell sx={{fontWeight: 'bold'}}>{formatMessage({ id: "globals.ingredients" })}</TableCell>
                                        <TableCell sx={{fontWeight: 'bold'}}>{formatMessage({ id: "globals.instructions" })}</TableCell>
                                        <TableCell sx={{fontWeight: 'bold', width: '250px'}}>{formatMessage({ id: "globals.actions" })}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center"><CircularProgress /></TableCell>
                                        </TableRow>
                                    ) : recipes.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">{formatMessage({ id: "globals.no_recipes_saved" })}</TableCell>
                                        </TableRow>
                                    ) : (
                                        recipes.map((recipe) => (
                                            <TableRow key={recipe.id}>
                                                <TableCell>{recipe.title}</TableCell>
                                                <TableCell>{recipe.ingredients}</TableCell>
                                                <TableCell>{recipe.instructions}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-2">
                                                        {!recipe.isPosted && (
                                                            <Button 
                                                                variant="contained" 
                                                                size="small" 
                                                                color="secondary"
                                                                onClick={() => handleOpenPublishModal(recipe)}
                                                            >
                                                                {formatMessage({ id: "globals.post_button" })}
                                                            </Button>
                                                        )}
                                                        <Button variant="outlined" size="small" color="primary" onClick={() => handleOpenEdit(recipe)}>
                                                            {formatMessage({ id: "globals.edit" })}
                                                        </Button>
                                                        <Button variant="outlined" size="small" color="error" onClick={() => { if(recipe.id) setDeleteRecipeId(recipe.id); }}>
                                                            {formatMessage({ id: "globals.delete" })}
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <TablePagination
                            component="div"
                            count={totalElements}
                            page={page}
                            onPageChange={(e, newPage) => setPage(newPage)}
                            rowsPerPage={pageSize}
                            rowsPerPageOptions={[3, 6, 12, 24]} 
                            onRowsPerPageChange={(e) => { setPageSize(parseInt(e.target.value, 10)); setPage(0); }}
                        />

                        <Dialog open={isFormOpen} onClose={() => setIsFormOpen(false)} fullWidth maxWidth="sm">
                            <DialogTitle>
                                {editingRecipeId ? formatMessage({ id: "globals.edit_recipe" }) : formatMessage({ id: "globals.add_new_recipe_title" })}
                            </DialogTitle>
                            <DialogContent className="flex flex-col gap-4 mt-2">
                                <TextField label={formatMessage({ id: "globals.recipe_title" })} variant="outlined" fullWidth value={newTitle} onChange={(e) => setNewTitle(e.target.value)} sx={{ mt: 1 }} />
                                <TextField label={formatMessage({ id: "globals.ingredients_placeholder" })} variant="outlined" fullWidth multiline rows={2} value={newIngredients} onChange={(e) => setNewIngredients(e.target.value)} />
                                <TextField label={formatMessage({ id: "globals.instructions_placeholder" })} variant="outlined" fullWidth multiline rows={4} value={newInstructions} onChange={(e) => setNewInstructions(e.target.value)} />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setIsFormOpen(false)} color="inherit">{formatMessage({ id: "globals.cancel" })}</Button>
                                <Button onClick={handleSubmitRecipe} variant="contained" color="success" disabled={isSubmitting}>
                                    {isSubmitting ? formatMessage({ id: "globals.saving" }) : formatMessage({ id: "globals.save" })}
                                </Button>
                            </DialogActions>
                        </Dialog>

                        <Dialog open={isPublishModalOpen} onClose={() => setIsPublishModalOpen(false)} fullWidth maxWidth="sm">
                            <DialogTitle>{formatMessage({ id: "globals.publish_recipe_title" })}: {recipeToPublish?.title}</DialogTitle>
                            <DialogContent className="flex flex-col gap-4 mt-2">
                                <DialogContentText>
                                    {formatMessage({ id: "globals.publish_description" })}
                                </DialogContentText>
                                <Box display="flex" flexDirection="column" alignItems="center" gap={2} my={2}>
                                    {previewImageUrl && (
                                        <img src={previewImageUrl} alt="Preview" style={{ width: '100%', maxHeight: '250px', objectFit: 'cover', borderRadius: '8px' }} />
                                    )}
                                    <Button variant="outlined" component="label" startIcon={<PhotoCameraIcon />}>
                                        {selectedImageFile ? formatMessage({ id: "globals.change_photo" }) : formatMessage({ id: "globals.choose_photo" })}
                                        <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                                    </Button>
                                </Box>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setIsPublishModalOpen(false)} color="inherit">{formatMessage({ id: "globals.cancel" })}</Button>
                                <Button onClick={handleConfirmPublish} variant="contained" color="secondary" disabled={isSubmitting}>
                                    {isSubmitting ? formatMessage({ id: "globals.publishing" }) : formatMessage({ id: "globals.publish_now" })}
                                </Button>
                            </DialogActions>
                        </Dialog>

                        <Dialog open={!!deleteRecipeId} onClose={() => setDeleteRecipeId(null)}>
                            <DialogTitle>{formatMessage({ id: "globals.confirm_delete" })}</DialogTitle>
                            <DialogContent>
                                <DialogContentText>{formatMessage({ id: "globals.confirm_delete_recipe_text" })}</DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setDeleteRecipeId(null)} color="inherit">{formatMessage({ id: "globals.cancel" })}</Button>
                                <Button onClick={handleConfirmDelete} color="error" variant="contained" disabled={isSubmitting}>
                                    {isSubmitting ? formatMessage({ id: "globals.deleting" }) : formatMessage({ id: "globals.delete_permanently" })}
                                </Button>
                            </DialogActions>
                        </Dialog>

                    </ContentCard>
                </div>
            </WebsiteLayout>
        </Fragment>
    );
});