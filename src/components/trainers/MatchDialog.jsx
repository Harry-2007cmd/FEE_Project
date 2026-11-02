import { useEffect, useRef } from "react";

export default function MatchDialog({ isOpen, onClose, onApply, coachList }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (dialogRef.current) {
      if (isOpen) dialogRef.current.showModal();
      else dialogRef.current.close();
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onClose();
    onApply(formData.get("goal"), formData.get("time"));
  };

  const handleBackdropClick = (e) => {
    if (e.target === dialogRef.current) onClose();
  };

  return (
    <dialog ref={dialogRef} id="matchDialog" className="match-dialog" aria-labelledby="matchTitle" onClick={handleBackdropClick}>
      <form id="matchForm" method="dialog" onSubmit={handleSubmit}>
        <h2 id="matchTitle">Find your match</h2>
        <p className="match-sub">Two quick questions and we'll filter the coaches for you.</p>
        <fieldset>
          <legend>What do you want to feel more of?</legend>
          <label><input type="radio" name="goal" value="Strength" required /><span>Stronger</span></label>
          <label><input type="radio" name="goal" value="Performance" /><span>Faster & fitter</span></label>
          <label><input type="radio" name="goal" value="Mindful movement" /><span>Calmer & more flexible</span></label>
          <label><input type="radio" name="goal" value="Nutrition" /><span>Better about food</span></label>
        </fieldset>
        <fieldset>
          <legend>When would you like to start?</legend>
          <label><input type="radio" name="time" value="today" required /><span>Today</span></label>
          <label><input type="radio" name="time" value="week" /><span>This week</span></label>
        </fieldset>
        <div className="match-actions">
          <button type="button" className="outline-button" id="matchCancel" onClick={onClose}>Cancel</button>
          <button type="submit" className="sun-button">Show my coaches →</button>
        </div>
      </form>
    </dialog>
  );
}