import { Fragment, memo, useState } from "react";
import { WebsiteLayout } from "presentation/layouts/WebsiteLayout";
import { Seo } from "@presentation/components/ui/Seo";
import { ContentCard } from "@presentation/components/ui/ContentCard";
import { 
    Button, TextField, FormControl, InputLabel, Select, MenuItem, 
    RadioGroup, FormControlLabel, Radio, Checkbox, FormGroup, Typography, Box 
} from "@mui/material";

import { FeedbackControllerApi, Configuration } from "@infrastructure/apis/client";
import { toast } from "react-toastify";
import { useAppSelector } from "@application/store";
import { useNavigate } from "react-router-dom";
import { AppRoute } from "routes";
import { useIntl } from "react-intl";

export const FeedbackPage = memo(() => {
    const { token } = useAppSelector(x => x.profileReducer);
    const navigate = useNavigate();
    const { formatMessage } = useIntl();

    const [source, setSource] = useState("");
    const [rating, setRating] = useState<number>(3);
    const [hadProblems, setHadProblems] = useState(false);
    const [suggestions, setSuggestions] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const orangeButtonStyle = {
        bgcolor: '#FF7034',
        color: 'white',
        '&:hover': {
            bgcolor: '#e65f2b',
        },
        fontWeight: 'bold',
        mt: 2,
        textTransform: 'none'
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!source) {
            toast.warning(formatMessage({ id: "globals.feedback.source_required" }));
            return;
        }

        setIsSubmitting(true);
        try {
            const api = new FeedbackControllerApi(new Configuration({ accessToken: token || undefined }));
            await api.submitFeedback({
                feedbackDto: { 
                    source: source, 
                    rating: rating, 
                    hadProblems: hadProblems, 
                    suggestions: suggestions 
                }
            });
            toast.success(formatMessage({ id: "globals.feedback.success" }));
            navigate(AppRoute.Index); 
        } catch (error) {
            console.error(error);
            toast.error(formatMessage({ id: "globals.feedback.error" }));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Fragment>
            <Seo title={`Custom Chef | ${formatMessage({ id: "globals.feedback.title" })}`} />
            <WebsiteLayout>
                <div className="pl- pr- max-w-2xl mx-auto py-10">
                    <ContentCard title={formatMessage({ id: "globals.feedback.card_title" })}>
                        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                            {formatMessage({ id: "globals.feedback.description" })}
                        </Typography>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            
                            <FormControl fullWidth>
                                <InputLabel id="source-label">{formatMessage({ id: "globals.feedback.source_label" })}</InputLabel>
                                <Select
                                    labelId="source-label"
                                    value={source}
                                    label={formatMessage({ id: "globals.feedback.source_label" })}
                                    onChange={(e) => setSource(e.target.value)}
                                >
                                    <MenuItem value="Instagram">Instagram</MenuItem>
                                    <MenuItem value="Facebook">Facebook</MenuItem>
                                    <MenuItem value="TikTok">TikTok</MenuItem>
                                    <MenuItem value="Prieteni">{formatMessage({ id: "globals.feedback.source_friends" })}</MenuItem>
                                    <MenuItem value="Other">{formatMessage({ id: "globals.feedback.source_other" })}</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl component="fieldset">
                                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium' }}>
                                    {formatMessage({ id: "globals.feedback.rating_label" })}
                                </Typography>
                                <RadioGroup 
                                    row 
                                    value={rating} 
                                    onChange={(e) => setRating(Number(e.target.value))}
                                    sx={{ justifyContent: 'space-between', px: 2 }}
                                >
                                    <FormControlLabel value={1} control={<Radio color="error"/>} label="1" />
                                    <FormControlLabel value={2} control={<Radio color="warning"/>} label="2" />
                                    <FormControlLabel value={3} control={<Radio color="primary"/>} label="3" />
                                    <FormControlLabel value={4} control={<Radio color="info"/>} label="4" />
                                    <FormControlLabel value={5} control={<Radio color="success"/>} label="5" />
                                </RadioGroup>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, fontSize: '0.75rem', color: '#666' }}>
                                    <span>{formatMessage({ id: "globals.feedback.rating_very_bad" })}</span>
                                    <span>{formatMessage({ id: "globals.feedback.rating_excellent" })}</span>
                                </Box>
                            </FormControl>

                            <FormGroup>
                                <FormControlLabel 
                                    control={
                                        <Checkbox 
                                            checked={hadProblems} 
                                            onChange={(e) => setHadProblems(e.target.checked)} 
                                            color="primary"
                                        />
                                    } 
                                    label={formatMessage({ id: "globals.feedback.problems_label" })} 
                                />
                            </FormGroup>

                            <TextField
                                label={formatMessage({ id: "globals.feedback.suggestions_label" })}
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={4}
                                value={suggestions}
                                onChange={(e) => setSuggestions(e.target.value)}
                                placeholder={formatMessage({ id: "globals.feedback.suggestions_placeholder" })}
                            />

                            <Button 
                                type="submit" 
                                variant="contained" 
                                size="large"
                                disabled={isSubmitting}
                                sx={orangeButtonStyle}
                            >
                                {isSubmitting ? formatMessage({ id: "globals.feedback.sending" }) : formatMessage({ id: "globals.feedback.submit_button" })}
                            </Button>
                        </form>
                    </ContentCard>
                </div>
            </WebsiteLayout>
        </Fragment>
    );
});