"use client";

import { HelpCircle, Keyboard } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

export function PromptFooter() {
    return (
        <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
            <span className="hidden select-none font-medium leading-normal md:inline">
                &ldquo;The best way to predict the future is to create it.&rdquo; &mdash; Peter Drucker
            </span>

            <div className="flex flex-1 items-center justify-between gap-4 md:flex-initial md:justify-end">
                {/* Help Center */}
                <Dialog>
                    <DialogTrigger className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer bg-transparent border-0 p-0 text-xs font-normal text-muted-foreground whitespace-nowrap">
                        <HelpCircle className="size-3.5" />
                        <span>Help Center</span>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <HelpCircle className="size-5 text-brand-600 animate-pulse" />
                                Help Center
                            </DialogTitle>
                            <DialogDescription className="pt-2 text-sm leading-relaxed text-muted-foreground">
                                Welcome to OmniAI! Here are some quick tips to help you get the most out of your intelligence hub:
                                <br /><br />
                                <strong>1. Dynamic Models:</strong> Switch between specialized models using the model selection chips above the prompt box.
                                <br />
                                <strong>2. Pinning Chats:</strong> Hover over any conversation in the sidebar and click the Options button to Pin popular chats to the top.
                                <br />
                                <strong>3. Image Attachments:</strong> Click the paperclip icon in the inputs box to upload images and analyze them with vision-capable models.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter showCloseButton />
                    </DialogContent>
                </Dialog>

                {/* Shortcuts */}
                <Dialog>
                    <DialogTrigger className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer bg-transparent border-0 p-0 text-xs font-normal text-muted-foreground whitespace-nowrap">
                        <Keyboard className="size-3.5" />
                        <span>Shortcuts</span>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Keyboard className="size-5 text-brand-600" />
                                Keyboard Shortcuts
                            </DialogTitle>
                            <DialogDescription className="pt-2">
                                Accelerate your workflow with these keyboard commands:
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3 py-3 text-sm">
                            <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                                <span>Submit Prompt</span>
                                <kbd className="rounded bg-muted px-2 py-0.5 text-xs font-mono font-bold shadow-xs">Enter</kbd>
                            </div>
                            <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                                <span>Insert New Line</span>
                                <kbd className="rounded bg-muted px-2 py-0.5 text-xs font-mono font-bold shadow-xs">Shift + Enter</kbd>
                            </div>
                            <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                                <span>Focus Input Panel</span>
                                <kbd className="rounded bg-muted px-2 py-0.5 text-xs font-mono font-bold shadow-xs">Esc</kbd>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Start New Conversation</span>
                                <kbd className="rounded bg-muted px-2 py-0.5 text-xs font-mono font-bold shadow-xs">Ctrl + ESC</kbd>
                            </div>
                        </div>
                        <DialogFooter showCloseButton />
                    </DialogContent>
                </Dialog>

                {/* Online status */}
                <a
                    href="https://status.omniai.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer decoration-none whitespace-nowrap"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                    </span>
                    <span>online</span>
                </a>
            </div>
        </div>
    );
}
