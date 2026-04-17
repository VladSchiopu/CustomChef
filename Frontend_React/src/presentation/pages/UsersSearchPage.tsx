import { Fragment, memo, useState, useEffect } from "react";
import { WebsiteLayout } from "presentation/layouts/WebsiteLayout";
import { Seo } from "@presentation/components/ui/Seo";
import { ContentCard } from "@presentation/components/ui/ContentCard";
import { 
    TextField, Button, CircularProgress, List, ListItem, 
    ListItemText, ListItemAvatar, Avatar, Divider, Typography
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';

import { UserControllerApi, UserDto, Configuration } from "@infrastructure/apis/client";
import { toast } from "react-toastify";
import { useAppSelector } from "@application/store";
import { useNavigate, useSearchParams } from "react-router-dom";

export const UsersSearchPage = memo(() => {
    const { token } = useAppSelector(x => x.profileReducer);
    const navigate = useNavigate();
    
    const [searchParams] = useSearchParams();
    const initialQuery = searchParams.get("query") || "";

    const [search, setSearch] = useState(initialQuery);
    const [users, setUsers] = useState<UserDto[]>([]);
    const [loading, setLoading] = useState(false);

    const searchUsers = async (query: string) => {
        if (!query) {
            setUsers([]);
            return;
        }
        setLoading(true);
        try {
            const api = new UserControllerApi(new Configuration({
                accessToken: token || undefined
            }));
            const response = await api.search({ name: query });
            setUsers(response || []);
        } catch (error) {
            console.error("Searching error", error);
            toast.error("An error occured while searching users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (initialQuery) {
            searchUsers(initialQuery);
        }
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            searchUsers(search);
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const toggleFollow = async (userId: string, isFollowed: boolean) => {
        try {
            const api = new UserControllerApi(new Configuration({ accessToken: token || undefined }));
            if (isFollowed) {
                await api.unfollow({ targetId: userId });
                toast.info("Nu mai urmărești acest utilizator.");
            } else {
                await api.follow({ targetId: userId });
                toast.success("Urmărești acest utilizator!");
            }
            searchUsers(search);
        } catch (error) {
            toast.error("Eroare la procesarea acțiunii.");
        }
    };

    return (
        <Fragment>
            <Seo title="Custom Chef | Caută Bucătari" />
            <WebsiteLayout>
                <div className="pl-[50px] pr-[50px]">
                    <ContentCard title="Găsește alți Pasionați de Gătit">
                        <div className="mb-6">
                            <TextField 
                                label="Caută după username..." 
                                variant="outlined" 
                                fullWidth
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        {loading ? (
                            <div className="flex justify-center p-4"><CircularProgress /></div>
                        ) : (
                            <List className="w-full bg-white rounded-md shadow-sm">
                                {users.length === 0 && search.length > 0 && (
                                    <Typography className="p-4 text-center text-gray-500">Niciun utilizator găsit.</Typography>
                                )}
                                {users.map((user, index) => (
                                    <Fragment key={user.id}>
                                        <ListItem alignItems="center" className="flex justify-between w-full">
                                            <div className="flex items-center gap-4">
                                                <ListItemAvatar><Avatar><PersonIcon /></Avatar></ListItemAvatar>
                                                <ListItemText primary={<Typography variant="h6">{user.username}</Typography>} secondary={user.email} />
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outlined" onClick={() => navigate(`/profile/${user.id}`)}>
                                                    Vezi Profil
                                                </Button>
                                                <Button 
                                                    variant={user.isFollowed ? "outlined" : "contained"} 
                                                    color={user.isFollowed ? "inherit" : "primary"}
                                                    onClick={() => toggleFollow(user.id!, user.isFollowed || false)}
                                                >
                                                    {user.isFollowed ? "Unfollow" : "Follow"}
                                                </Button>
                                            </div>
                                        </ListItem>
                                        {index < users.length - 1 && <Divider />}
                                    </Fragment>
                                ))}
                            </List>
                        )}
                    </ContentCard>
                </div>
            </WebsiteLayout>
        </Fragment>
    );
});